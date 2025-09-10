/**
 * Session Manager for NFC Wallet App
 * Implements secure session management with configurable timeouts (60-90 seconds)
 * Provides session creation, validation, renewal, and cleanup mechanisms
 */

import CryptoJS from 'crypto-js';
import { AIONETSecurityManager } from './aionetSecurity';

export interface Session {
  id: string;
  deviceId: string;
  startTime: number;
  lastActivity: number;
  expiryTime: number;
  timeout: number; // 60-90 seconds
  isActive: boolean;
  securityLevel: 'basic' | 'standard' | 'high';
  challenge: string;
  response: string;
  entropy: string;
  fingerprint: string;
  activityCount: number;
  riskScore: number;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
    deviceFingerprint: string;
  };
}

export interface SessionConfig {
  defaultTimeout: number; // Default 75 seconds (between 60-90)
  maxTimeout: number; // Maximum 90 seconds
  minTimeout: number; // Minimum 60 seconds
  renewalThreshold: number; // Renew if > 50% of timeout remaining
  maxConcurrentSessions: number; // Max sessions per device
  cleanupInterval: number; // Cleanup interval in milliseconds
  securityLevel: 'basic' | 'standard' | 'high';
}

export interface SessionValidationResult {
  isValid: boolean;
  session?: Session;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export class SessionManager {
  private static instance: SessionManager;
  private sessions: Map<string, Session> = new Map();
  private deviceSessions: Map<string, Set<string>> = new Map();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private config: SessionConfig;

  private constructor() {
    this.config = {
      defaultTimeout: 75000, // 75 seconds
      maxTimeout: 90000, // 90 seconds
      minTimeout: 60000, // 60 seconds
      renewalThreshold: 0.5, // 50%
      maxConcurrentSessions: 3,
      cleanupInterval: 30000, // 30 seconds
      securityLevel: 'standard',
    };

    this.startCleanupTimer();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Create a new session with security features
  async createSession(
    deviceId: string,
    securityLevel: 'basic' | 'standard' | 'high' = 'standard',
    customTimeout?: number
  ): Promise<Session> {
    // Check concurrent session limits
    await this.enforceConcurrentSessionLimit(deviceId);

    const sessionId = this.generateSecureSessionId();
    const timeout = this.validateTimeout(customTimeout || this.getTimeoutForSecurityLevel(securityLevel));
    const now = Date.now();

    // Generate security challenge
    const challenge = this.generateChallenge();
    const entropy = this.generateSessionEntropy();
    const fingerprint = this.generateDeviceFingerprint(deviceId, now);

    const session: Session = {
      id: sessionId,
      deviceId,
      startTime: now,
      lastActivity: now,
      expiryTime: now + timeout,
      timeout,
      isActive: true,
      securityLevel,
      challenge,
      response: '', // Will be set during validation
      entropy,
      fingerprint,
      activityCount: 0,
      riskScore: 0,
      metadata: {
        deviceFingerprint: fingerprint,
      },
    };

    // Store session
    this.sessions.set(sessionId, session);

    // Track device sessions
    if (!this.deviceSessions.has(deviceId)) {
      this.deviceSessions.set(deviceId, new Set());
    }
    this.deviceSessions.get(deviceId)!.add(sessionId);

    console.log(`🔐 Created session ${sessionId} for device ${deviceId} with ${timeout}ms timeout`);
    return session;
  }

  // Validate session with comprehensive security checks
  async validateSession(
    sessionId: string,
    deviceId: string,
    challengeResponse?: string,
    interactionData?: any
  ): Promise<SessionValidationResult> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return {
        isValid: false,
        reason: 'Session not found',
        riskLevel: 'high',
        recommendations: ['Request new session', 'Verify device identity'],
      };
    }

    if (!session.isActive) {
      return {
        isValid: false,
        reason: 'Session is inactive',
        riskLevel: 'medium',
        recommendations: ['Create new session', 'Check for suspicious activity'],
      };
    }

    // Check device binding
    if (session.deviceId !== deviceId) {
      return {
        isValid: false,
        reason: 'Device mismatch',
        riskLevel: 'critical',
        recommendations: ['Terminate session', 'Alert security team', 'Block device'],
      };
    }

    // Check expiry
    const now = Date.now();
    if (now > session.expiryTime) {
      session.isActive = false;
      return {
        isValid: false,
        reason: 'Session expired',
        riskLevel: 'low',
        recommendations: ['Create new session', 'Consider shorter timeout'],
      };
    }

    // Validate challenge-response if provided
    if (challengeResponse && !this.validateChallengeResponse(session, challengeResponse)) {
      session.riskScore += 20;
      return {
        isValid: false,
        reason: 'Invalid challenge response',
        riskLevel: 'high',
        recommendations: ['Request new challenge', 'Increase security level'],
      };
    }

    // Update session activity
    session.lastActivity = now;
    session.activityCount++;

    // Assess risk based on interaction patterns
    const riskAssessment = await this.assessSessionRisk(session, interactionData);

    // Check if session needs renewal
    const timeRemaining = session.expiryTime - now;
    const renewalNeeded = timeRemaining < (session.timeout * this.config.renewalThreshold);

    if (renewalNeeded) {
      await this.renewSession(session);
    }

    return {
      isValid: true,
      session,
      riskLevel: riskAssessment.riskLevel,
      recommendations: riskAssessment.recommendations,
    };
  }

  // Renew session with new timeout
  async renewSession(session: Session): Promise<void> {
    const now = Date.now();
    const newTimeout = this.calculateRenewalTimeout(session);
    session.expiryTime = now + newTimeout;
    session.lastActivity = now;

    // Generate new challenge for renewed session
    session.challenge = this.generateChallenge();
    session.entropy = this.generateSessionEntropy();

    console.log(`🔄 Renewed session ${session.id} with new timeout: ${newTimeout}ms`);
  }

  // Terminate session securely
  async terminateSession(sessionId: string, reason: string = 'User logout'): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      console.log(`🚪 Terminated session ${sessionId}: ${reason}`);

      // Remove from device tracking
      const deviceSessions = this.deviceSessions.get(session.deviceId);
      if (deviceSessions) {
        deviceSessions.delete(sessionId);
        if (deviceSessions.size === 0) {
          this.deviceSessions.delete(session.deviceId);
        }
      }
    }
  }

  // Get active sessions for a device
  getActiveSessionsForDevice(deviceId: string): Session[] {
    const sessionIds = this.deviceSessions.get(deviceId);
    if (!sessionIds) return [];

    return Array.from(sessionIds)
      .map(id => this.sessions.get(id))
      .filter(session => session && session.isActive) as Session[];
  }

  // Clean up expired sessions
  cleanupExpiredSessions(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions) {
      if (!session.isActive || now > session.expiryTime) {
        this.terminateSession(sessionId, 'Expired during cleanup');
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  // Get session statistics
  getSessionStats(): {
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
    averageSessionDuration: number;
    sessionsBySecurityLevel: Record<string, number>;
  } {
    const now = Date.now();
    let activeCount = 0;
    let expiredCount = 0;
    let totalDuration = 0;
    const securityLevelCounts: Record<string, number> = {
      basic: 0,
      standard: 0,
      high: 0,
    };

    for (const session of this.sessions.values()) {
      securityLevelCounts[session.securityLevel]++;

      if (session.isActive && now <= session.expiryTime) {
        activeCount++;
        totalDuration += (session.lastActivity - session.startTime);
      } else {
        expiredCount++;
      }
    }

    return {
      totalSessions: this.sessions.size,
      activeSessions: activeCount,
      expiredSessions: expiredCount,
      averageSessionDuration: activeCount > 0 ? totalDuration / activeCount : 0,
      sessionsBySecurityLevel: securityLevelCounts,
    };
  }

  // Update session configuration
  updateConfig(newConfig: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Updated session configuration:', newConfig);
  }

  // Private helper methods

  private generateSecureSessionId(): string {
    const timestamp = Date.now().toString();
    const random = CryptoJS.lib.WordArray.random(16).toString();
    const deviceInfo = AIONETSecurityManager.getInstance().getDeviceInfo();

    return CryptoJS.SHA256(timestamp + random + deviceInfo.deviceId).toString().substring(0, 32);
  }

  private validateTimeout(timeout: number): number {
    return Math.max(this.config.minTimeout, Math.min(this.config.maxTimeout, timeout));
  }

  private getTimeoutForSecurityLevel(level: 'basic' | 'standard' | 'high'): number {
    switch (level) {
      case 'basic': return 60000; // 60 seconds
      case 'standard': return 75000; // 75 seconds
      case 'high': return 90000; // 90 seconds
      default: return this.config.defaultTimeout;
    }
  }

  private generateChallenge(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  private generateSessionEntropy(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  private generateDeviceFingerprint(deviceId: string, timestamp: number): string {
    const data = deviceId + timestamp.toString() + Math.random().toString();
    return CryptoJS.SHA256(data).toString();
  }

  private validateChallengeResponse(session: Session, response: string): boolean {
    const expectedResponse = CryptoJS.SHA256(session.challenge + session.deviceId + session.entropy).toString();
    return response === expectedResponse;
  }

  private async enforceConcurrentSessionLimit(deviceId: string): Promise<void> {
    const activeSessions = this.getActiveSessionsForDevice(deviceId);

    if (activeSessions.length >= this.config.maxConcurrentSessions) {
      // Terminate oldest session
      const oldestSession = activeSessions.reduce((oldest, current) =>
        current.startTime < oldest.startTime ? current : oldest
      );

      await this.terminateSession(oldestSession.id, 'Concurrent session limit exceeded');
      console.log(`⚠️ Terminated oldest session for device ${deviceId} due to concurrent limit`);
    }
  }

  private calculateRenewalTimeout(session: Session): number {
    // Adaptive timeout based on session activity and risk
    let baseTimeout = session.timeout;

    // Reduce timeout for high-risk sessions
    if (session.riskScore > 50) {
      baseTimeout *= 0.8;
    }

    // Increase timeout for low-risk, active sessions
    if (session.riskScore < 20 && session.activityCount > 5) {
      baseTimeout *= 1.1;
    }

    return this.validateTimeout(baseTimeout);
  }

  private async assessSessionRisk(session: Session, interactionData?: any): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
  }> {
    let riskScore = session.riskScore;
    let recommendations: string[] = [];

    // Assess based on session age
    const sessionAge = Date.now() - session.startTime;
    if (sessionAge > 300000) { // 5 minutes
      riskScore += 10;
    }

    // Assess based on activity patterns
    if (session.activityCount > 100) {
      riskScore += 5; // High activity might indicate automation
    }

    // Assess based on interaction data if provided
    if (interactionData) {
      const interactionRisk = this.assessInteractionRisk(interactionData);
      riskScore += interactionRisk;
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore < 30) riskLevel = 'low';
    else if (riskScore < 60) riskLevel = 'medium';
    else if (riskScore < 80) riskLevel = 'high';
    else riskLevel = 'critical';

    // Generate recommendations
    recommendations = this.generateRiskRecommendations(riskLevel, session);

    // Update session risk score
    session.riskScore = Math.min(100, riskScore);

    return { riskLevel, recommendations };
  }

  private assessInteractionRisk(interactionData: any): number {
    let risk = 0;

    // Check for suspicious timing patterns
    if (interactionData.responseTime && interactionData.responseTime < 50) {
      risk += 15; // Too fast response
    }

    // Check for perfect patterns (suspicious)
    if (interactionData.patternConsistency && interactionData.patternConsistency > 0.95) {
      risk += 10;
    }

    // Check for unusual pressure patterns
    if (interactionData.pressure && interactionData.pressure > 0.95) {
      risk += 10; // Too much pressure
    }

    return risk;
  }

  private generateRiskRecommendations(riskLevel: string, session: Session): string[] {
    const recommendations: string[] = [];

    switch (riskLevel) {
      case 'low':
        recommendations.push('Session is secure');
        break;
      case 'medium':
        recommendations.push('Monitor session activity');
        recommendations.push('Consider reducing session timeout');
        break;
      case 'high':
        recommendations.push('Increase security monitoring');
        recommendations.push('Require additional authentication');
        recommendations.push('Shorten session timeout');
        break;
      case 'critical':
        recommendations.push('Terminate session immediately');
        recommendations.push('Alert security team');
        recommendations.push('Block device temporarily');
        recommendations.push('Require full re-authentication');
        break;
    }

    if (session.activityCount > 50) {
      recommendations.push('High activity detected - review for automation');
    }

    return recommendations;
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredSessions();
    }, this.config.cleanupInterval);
  }

  // Graceful shutdown
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    // Terminate all active sessions
    for (const session of this.sessions.values()) {
      if (session.isActive) {
        this.terminateSession(session.id, 'Application shutdown');
      }
    }

    this.sessions.clear();
    this.deviceSessions.clear();
  }
}

// Session monitoring utilities
export class SessionMonitor {
  private static instance: SessionMonitor;
  private sessionManager: SessionManager;
  private monitoringActive = false;
  private alertThresholds = {
    highActivity: 50, // Sessions with > 50 activities
    longRunning: 240000, // 4 minutes
    highRisk: 70, // Risk score > 70
  };

  private constructor() {
    this.sessionManager = SessionManager.getInstance();
  }

  static getInstance(): SessionMonitor {
    if (!SessionMonitor.instance) {
      SessionMonitor.instance = new SessionMonitor();
    }
    return SessionMonitor.instance;
  }

  // Start monitoring sessions
  startMonitoring(): void {
    if (this.monitoringActive) return;

    this.monitoringActive = true;
    this.monitorSessions();

    console.log('📊 Session monitoring started');
  }

  // Stop monitoring
  stopMonitoring(): void {
    this.monitoringActive = false;
    console.log('📊 Session monitoring stopped');
  }

  // Monitor sessions and generate alerts
  private monitorSessions(): void {
    if (!this.monitoringActive) return;

    const stats = this.sessionManager.getSessionStats();
    const alerts: string[] = [];

    // Check for high activity sessions
    for (const session of this.sessionManager['sessions'].values()) {
      if (session.activityCount > this.alertThresholds.highActivity) {
        alerts.push(`High activity session: ${session.id} (${session.activityCount} activities)`);
      }

      if (session.riskScore > this.alertThresholds.highRisk) {
        alerts.push(`High risk session: ${session.id} (risk: ${session.riskScore})`);
      }

      const sessionDuration = Date.now() - session.startTime;
      if (sessionDuration > this.alertThresholds.longRunning) {
        alerts.push(`Long running session: ${session.id} (${Math.round(sessionDuration / 1000)}s)`);
      }
    }

    // Log alerts
    if (alerts.length > 0) {
      console.log('🚨 Session Alerts:', alerts);
    }

    // Schedule next monitoring cycle
    setTimeout(() => this.monitorSessions(), 10000); // Check every 10 seconds
  }

  // Get monitoring report
  getMonitoringReport(): {
    alerts: string[];
    stats: any;
    recommendations: string[];
  } {
    const stats = this.sessionManager.getSessionStats();
    const alerts: string[] = [];
    const recommendations: string[] = [];

    // Generate alerts based on current state
    if (stats.activeSessions > 10) {
      alerts.push('High number of active sessions');
      recommendations.push('Consider reducing session timeout');
    }

    if (stats.averageSessionDuration > 120000) { // 2 minutes
      alerts.push('Sessions running longer than expected');
      recommendations.push('Review session renewal policies');
    }

    return {
      alerts,
      stats,
      recommendations,
    };
  }

  // Update monitoring thresholds
  updateThresholds(thresholds: Partial<typeof SessionMonitor.prototype.alertThresholds>): void {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
    console.log('⚙️ Updated monitoring thresholds:', thresholds);
  }
}

export default SessionManager;
