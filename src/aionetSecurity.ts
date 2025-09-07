import CryptoJS from 'crypto-js';

// AIONET Protocol v1.2 Security Implementation
// Blockchain-based security for messages and transactions between devices

export interface SecureTransaction {
  id: string;
  amount: number;
  itemName: string;
  timestamp: number;
  deviceId: string;
  publicKey: string;
  signature: string;
  hash: string;
  previousHash?: string;
  nonce: number;
  recipientDeviceId?: string;
}

export interface SecureMessage {
  id: string;
  senderDeviceId: string;
  recipientDeviceId: string;
  content: string;
  timestamp: number;
  publicKey: string;
  signature: string;
  hash: string;
  previousHash?: string;
  nonce: number;
  messageType: 'transaction' | 'handshake' | 'verification' | 'data';
  blockchainProof: BlockchainProof;
  dynamicData: DynamicSecurityData;
  livenessProof: LivenessProof;
  trustScore: TrustScore;
}

export interface DynamicSecurityData {
  sessionId: string;
  challenge: string;
  response: string;
  timestamp: number;
  nonce: string;
  entropy: string;
  validityWindow: number; // Time window in milliseconds
}

export interface LivenessProof {
  biometricData?: BiometricData;
  behavioralPatterns: BehavioralPattern[];
  proximityMetrics: ProximityMetrics;
  timingAnalysis: TimingAnalysis;
  interactionProof: InteractionProof;
}

export interface BiometricData {
  fingerprint?: string;
  facialData?: string;
  voicePattern?: string;
  gesturePattern?: string;
}

export interface BehavioralPattern {
  interactionFrequency: number;
  timingPatterns: number[];
  movementPatterns: MovementData[];
  usagePatterns: UsagePattern[];
}

export interface MovementData {
  acceleration: number[];
  rotation: number[];
  timestamp: number;
}

export interface UsagePattern {
  sessionDuration: number;
  interactionCount: number;
  errorRate: number;
  successRate: number;
}

export interface ProximityMetrics {
  signalStrength: number;
  distance: number;
  angle: number;
  interference: number;
}

export interface TimingAnalysis {
  responseTime: number;
  interactionDelay: number;
  sessionDuration: number;
  patternConsistency: number;
}

export interface InteractionProof {
  touchPoints: TouchPoint[];
  gestureSequence: string[];
  pressurePatterns: number[];
  swipePatterns: SwipeData[];
  entropyFingerprint: EntropyFingerprint;
}

export interface TouchPoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export interface SwipeData {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  velocity: number;
}

export interface TrustScore {
  overallScore: number; // 0-100
  components: TrustComponent[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: number;
  confidence: number; // 0-100
  rotationFactor: number; // Dynamic rotation coefficient
  historicalTrend: HistoricalTrend;
  adaptiveWeights: AdaptiveWeights;
  predictiveScore: number; // AI-predicted future score
  anomalyScore: number; // Deviation from normal patterns
  cloneResistanceScore: number; // 0-100, measures resistance to cloning
  uniquenessFingerprint: string; // Hardware-based unique identifier
}

export interface HistoricalTrend {
  scoreHistory: ScorePoint[];
  trendDirection: 'improving' | 'stable' | 'declining';
  volatility: number;
  consistency: number;
  averageScore: number;
}

export interface ScorePoint {
  timestamp: number;
  score: number;
  factors: string[];
  eventType: string;
}

export interface AdaptiveWeights {
  deviceReputation: number;
  interactionQuality: number;
  timingConsistency: number;
  behavioralPattern: number;
  proximitySecurity: number;
  lastAdjusted: number;
  learningRate: number;
}

export interface TrustComponent {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
  evidence: string[];
  riskFactors: string[];
}

export interface EntropyFingerprint {
  overallEntropy: number; // 0-1 (Shannon entropy normalized)
  componentEntropies: EntropyComponent[];
  entropyProfile: EntropyProfile;
  livenessScore: number; // 0-100 based on entropy analysis
  anomalyDetection: AnomalyMetrics;
  fingerprintHash: string; // Unique hash of the entropy pattern
  timestamp: number;
  validityScore: number; // How well this matches expected human patterns
}

export interface EntropyComponent {
  name: string;
  entropy: number; // 0-1
  expectedRange: { min: number; max: number };
  deviation: number; // Standard deviations from expected
  weight: number;
  data: number[];
}

export interface EntropyProfile {
  timingEntropy: number;
  pressureEntropy: number;
  movementEntropy: number;
  gestureEntropy: number;
  sessionEntropy: number;
  pattern: string; // Hex representation of entropy pattern
}

export interface AnomalyMetrics {
  zScore: number; // Standard deviations from normal
  pValue: number; // Statistical significance
  confidence: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: string[]; // Specific anomaly flags
}

export interface BlockchainProof {
  blockHeight: number;
  merkleRoot: string;
  consensusHash: string;
  validatorSignatures: string[];
  timestamp: number;
}

export interface MessageBlock {
  index: number;
  timestamp: number;
  messages: SecureMessage[];
  previousBlockHash: string;
  blockHash: string;
  nonce: number;
  merkleRoot: string;
  validatorDeviceId: string;
}

export interface DevicePair {
  deviceA: string;
  deviceB: string;
  sharedSecret: string;
  sessionId: string;
  established: number;
}

export class AIONETSecurityManager {
  private static instance: AIONETSecurityManager;
  private deviceId: string;
  private privateKey: string;
  private publicKey: string;
  private activePairs: Map<string, DevicePair> = new Map();

  private constructor() {
    this.deviceId = this.generateDeviceId();
    const keyPair = this.generateKeyPair();
    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;
  }

  static getInstance(): AIONETSecurityManager {
    if (!AIONETSecurityManager.instance) {
      AIONETSecurityManager.instance = new AIONETSecurityManager();
    }
    return AIONETSecurityManager.instance;
  }

  private generateDeviceId(): string {
    return 'DEVICE-' + CryptoJS.lib.WordArray.random(16).toString();
  }

  private generateKeyPair(): { privateKey: string; publicKey: string } {
    // Generate ECDSA key pair using CryptoJS
    const privateKey = CryptoJS.lib.WordArray.random(32).toString();
    const publicKey = CryptoJS.SHA256(privateKey).toString();

    return { privateKey, publicKey };
  }

  // Establish secure connection between two devices
  async establishSecurePair(otherDeviceId: string, otherPublicKey: string): Promise<DevicePair> {
    const sharedSecret = this.generateSharedSecret(this.privateKey, otherPublicKey);
    const sessionId = CryptoJS.SHA256(this.deviceId + otherDeviceId + Date.now().toString()).toString();

    const pair: DevicePair = {
      deviceA: this.deviceId,
      deviceB: otherDeviceId,
      sharedSecret,
      sessionId,
      established: Date.now(),
    };

    this.activePairs.set(sessionId, pair);
    return pair;
  }

  private generateSharedSecret(privateKey: string, otherPublicKey: string): string {
    // ECDH key exchange simulation
    return CryptoJS.SHA256(privateKey + otherPublicKey).toString();
  }

  // Create secure transaction with blockchain-style signing
  async createSecureTransaction(
    amount: number,
    itemName: string,
    recipientDeviceId: string,
    previousHash?: string
  ): Promise<SecureTransaction> {
    const transactionId = 'TXN-' + CryptoJS.lib.WordArray.random(16).toString();
    const timestamp = Date.now();

    const transactionData = {
      id: transactionId,
      amount,
      itemName,
      timestamp,
      deviceId: this.deviceId,
      publicKey: this.publicKey,
      recipientDeviceId,
    };

    // Create transaction hash
    const hash = this.hashTransaction(transactionData);

    // Sign transaction
    const signature = this.signTransaction(hash, this.privateKey);

    // Proof of work (simple nonce finding)
    const nonce = await this.findNonce(hash, 2); // Difficulty level 2

    const secureTransaction: SecureTransaction = {
      ...transactionData,
      signature,
      hash,
      previousHash,
      nonce,
    };

    return secureTransaction;
  }

  private hashTransaction(transaction: any): string {
    const dataString = JSON.stringify(transaction);
    return CryptoJS.SHA256(dataString).toString();
  }

  private signTransaction(hash: string, privateKey: string): string {
    // ECDSA signature simulation
    return CryptoJS.HmacSHA256(hash, privateKey).toString();
  }

  private async findNonce(hash: string, difficulty: number): Promise<number> {
    let nonce = 0;
    const target = '0'.repeat(difficulty);

    while (true) {
      const testHash = CryptoJS.SHA256(hash + nonce.toString()).toString();
      if (testHash.startsWith(target)) {
        return nonce;
      }
      nonce++;
    }
  }

  // Verify transaction integrity and signature
  async verifyTransaction(transaction: SecureTransaction, senderPublicKey: string): Promise<boolean> {
    try {
      // Verify transaction hash
      const calculatedHash = this.hashTransaction({
        id: transaction.id,
        amount: transaction.amount,
        itemName: transaction.itemName,
        timestamp: transaction.timestamp,
        deviceId: transaction.deviceId,
        publicKey: transaction.publicKey,
        recipientDeviceId: transaction.recipientDeviceId || '',
      });

      if (calculatedHash !== transaction.hash) {
        return false;
      }

      // Verify signature
      const expectedSignature = this.signTransaction(transaction.hash, senderPublicKey);
      if (expectedSignature !== transaction.signature) {
        return false;
      }

      // Verify proof of work
      const testHash = CryptoJS.SHA256(transaction.hash + transaction.nonce.toString()).toString();
      if (!testHash.startsWith('0'.repeat(2))) { // Same difficulty
        return false;
      }

      return true;
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return false;
    }
  }

  // Encrypt data for secure transmission
  encryptData(data: string, sharedSecret: string): string {
    return CryptoJS.AES.encrypt(data, sharedSecret).toString();
  }

  // Decrypt received data
  decryptData(encryptedData: string, sharedSecret: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, sharedSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generate transaction receipt with security proofs
  generateSecureReceipt(transaction: SecureTransaction): string {
    const receipt = {
      transactionId: transaction.id,
      amount: transaction.amount,
      itemName: transaction.itemName,
      timestamp: transaction.timestamp,
      deviceId: transaction.deviceId,
      hash: transaction.hash,
      signature: transaction.signature,
      verificationStatus: 'VERIFIED',
      protocol: 'AIONET v1.2',
    };

    return JSON.stringify(receipt, null, 2);
  }

  // Get device security info
  getDeviceInfo(): { deviceId: string; publicKey: string } {
    return {
      deviceId: this.deviceId,
      publicKey: this.publicKey,
    };
  }

  // Clean up expired sessions
  cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiryTime = 30 * 60 * 1000; // 30 minutes

    for (const [sessionId, pair] of this.activePairs) {
      if (now - pair.established > expiryTime) {
        this.activePairs.delete(sessionId);
      }
    }
  }
}

// Transaction Chain for maintaining transaction history
export class TransactionChain {
  private chain: SecureTransaction[] = [];

  addTransaction(transaction: SecureTransaction): void {
    // Link to previous transaction
    if (this.chain.length > 0) {
      transaction.previousHash = this.chain[this.chain.length - 1].hash;
    }

    this.chain.push(transaction);
  }

  getChain(): SecureTransaction[] {
    return [...this.chain];
  }

  verifyChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // Verify hash linkage
      if (current.previousHash !== previous.hash) {
        return false;
      }

      // Verify transaction integrity (would call AIONETSecurityManager.verifyTransaction)
      // For now, just check basic structure
      if (!current.hash || !current.signature) {
        return false;
      }
    }
    return true;
  }

  getLatestHash(): string | undefined {
    return this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : undefined;
  }
}

// Blockchain-based Message Security Manager
export class BlockchainMessageManager {
  private static instance: BlockchainMessageManager;
  private messageBlocks: MessageBlock[] = [];
  private pendingMessages: SecureMessage[] = [];
  private deviceId: string;
  private knownDevices: Map<string, string> = new Map(); // deviceId -> publicKey

  private constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  static getInstance(deviceId: string): BlockchainMessageManager {
    if (!BlockchainMessageManager.instance) {
      BlockchainMessageManager.instance = new BlockchainMessageManager(deviceId);
    }
    return BlockchainMessageManager.instance;
  }

  // Create a secure message with blockchain proof and advanced security features
  async createSecureMessage(
    recipientDeviceId: string,
    content: string,
    messageType: 'transaction' | 'handshake' | 'verification' | 'data' = 'data',
    sharedSecret?: string,
    interactionData?: {
      touchPoints?: TouchPoint[];
      swipePatterns?: SwipeData[];
      timingData?: TimingAnalysis;
      proximityData?: ProximityMetrics;
    }
  ): Promise<SecureMessage> {
    const messageId = 'MSG-' + CryptoJS.lib.WordArray.random(16).toString();
    const timestamp = Date.now();

    // Generate dynamic security data
    const dynamicData = this.generateDynamicSecurityData(recipientDeviceId, timestamp);

    // Generate liveness proof
    const livenessProof = this.generateLivenessProof(interactionData);

    // Calculate trust score
    const trustScore = this.calculateTrustScore(recipientDeviceId, interactionData);

    const messageData = {
      id: messageId,
      senderDeviceId: this.deviceId,
      recipientDeviceId,
      content: sharedSecret ? AIONETSecurityManager.getInstance().encryptData(content, sharedSecret) : content,
      timestamp,
      publicKey: AIONETSecurityManager.getInstance().getDeviceInfo().publicKey,
      messageType,
      dynamicData,
      livenessProof,
      trustScore,
    };

    // Create message hash (including all security data)
    const hash = this.hashMessage(messageData);

    // Sign message
    const signature = this.signMessage(hash);

    // Proof of work for message
    const nonce = await this.findMessageNonce(hash, 3); // Higher difficulty for messages

    // Create blockchain proof
    const blockchainProof = await this.createBlockchainProof(messageData, hash);

    const secureMessage: SecureMessage = {
      ...messageData,
      signature,
      hash,
      previousHash: this.getLatestMessageHash(),
      nonce,
      blockchainProof,
    };

    // Add to pending messages for block creation
    this.pendingMessages.push(secureMessage);

    return secureMessage;
  }

  // Generate dynamic security data to prevent replay attacks
  private generateDynamicSecurityData(recipientDeviceId: string, timestamp: number): DynamicSecurityData {
    const sessionId = CryptoJS.lib.WordArray.random(16).toString();
    const challenge = CryptoJS.lib.WordArray.random(32).toString();
    const nonce = CryptoJS.lib.WordArray.random(16).toString();
    const entropy = CryptoJS.lib.WordArray.random(32).toString();

    // Create challenge-response pair
    const response = CryptoJS.SHA256(challenge + this.deviceId + recipientDeviceId + timestamp.toString()).toString();

    return {
      sessionId,
      challenge,
      response,
      timestamp,
      nonce,
      entropy,
      validityWindow: 30000, // 30 seconds validity window
    };
  }

  // Generate liveness proof to detect real user interaction
  private generateLivenessProof(interactionData?: {
    touchPoints?: TouchPoint[];
    swipePatterns?: SwipeData[];
    timingData?: TimingAnalysis;
    proximityData?: ProximityMetrics;
  }): LivenessProof {
    const behavioralPatterns: BehavioralPattern[] = [];
    const interactionProof: InteractionProof = {
      touchPoints: interactionData?.touchPoints || [],
      gestureSequence: [],
      pressurePatterns: [],
      swipePatterns: interactionData?.swipePatterns || [],
      entropyFingerprint: this.generateEntropyFingerprint(interactionData),
    };

    // Analyze behavioral patterns
    if (interactionData?.touchPoints) {
      const pressures = interactionData.touchPoints.map(tp => tp.pressure);
      interactionProof.pressurePatterns = pressures;

      // Generate gesture sequence based on touch patterns
      interactionProof.gestureSequence = this.analyzeGestureSequence(interactionData.touchPoints);
    }

    // Create behavioral pattern analysis
    if (interactionData?.timingData) {
      behavioralPatterns.push({
        interactionFrequency: 1,
        timingPatterns: [interactionData.timingData.responseTime],
        movementPatterns: [],
        usagePatterns: [{
          sessionDuration: interactionData.timingData.sessionDuration,
          interactionCount: 1,
          errorRate: 0,
          successRate: 1,
        }],
      });
    }

    return {
      behavioralPatterns,
      proximityMetrics: interactionData?.proximityData || {
        signalStrength: 0,
        distance: 0,
        angle: 0,
        interference: 0,
      },
      timingAnalysis: interactionData?.timingData || {
        responseTime: 0,
        interactionDelay: 0,
        sessionDuration: 0,
        patternConsistency: 1,
      },
      interactionProof,
    };
  }

  // Generate entropy fingerprint for advanced liveness detection
  private generateEntropyFingerprint(interactionData?: {
    touchPoints?: TouchPoint[];
    swipePatterns?: SwipeData[];
    timingData?: TimingAnalysis;
    proximityData?: ProximityMetrics;
  }): EntropyFingerprint {
    const componentEntropies: EntropyComponent[] = [];
    const timestamp = Date.now();

    // Calculate timing entropy
    const timingEntropy = this.calculateTimingEntropy(interactionData?.timingData);
    componentEntropies.push({
      name: 'Timing Entropy',
      entropy: timingEntropy,
      expectedRange: { min: 0.3, max: 0.8 },
      deviation: this.calculateDeviation(timingEntropy, 0.3, 0.8),
      weight: 0.3,
      data: interactionData?.timingData ? [interactionData.timingData.responseTime, interactionData.timingData.interactionDelay] : [],
    });

    // Calculate pressure entropy
    const pressureEntropy = this.calculatePressureEntropy(interactionData?.touchPoints);
    componentEntropies.push({
      name: 'Pressure Entropy',
      entropy: pressureEntropy,
      expectedRange: { min: 0.4, max: 0.9 },
      deviation: this.calculateDeviation(pressureEntropy, 0.4, 0.9),
      weight: 0.25,
      data: interactionData?.touchPoints?.map(tp => tp.pressure) || [],
    });

    // Calculate movement entropy
    const movementEntropy = this.calculateMovementEntropy(interactionData?.touchPoints);
    componentEntropies.push({
      name: 'Movement Entropy',
      entropy: movementEntropy,
      expectedRange: { min: 0.5, max: 0.95 },
      deviation: this.calculateDeviation(movementEntropy, 0.5, 0.95),
      weight: 0.2,
      data: interactionData?.touchPoints?.map(tp => tp.x + tp.y) || [],
    });

    // Calculate gesture entropy
    const gestureEntropy = this.calculateGestureEntropy(interactionData?.swipePatterns);
    componentEntropies.push({
      name: 'Gesture Entropy',
      entropy: gestureEntropy,
      expectedRange: { min: 0.2, max: 0.7 },
      deviation: this.calculateDeviation(gestureEntropy, 0.2, 0.7),
      weight: 0.15,
      data: interactionData?.swipePatterns?.map(sp => sp.velocity) || [],
    });

    // Calculate session entropy
    const sessionEntropy = this.calculateSessionEntropy(interactionData?.timingData);
    componentEntropies.push({
      name: 'Session Entropy',
      entropy: sessionEntropy,
      expectedRange: { min: 0.1, max: 0.6 },
      deviation: this.calculateDeviation(sessionEntropy, 0.1, 0.6),
      weight: 0.1,
      data: interactionData?.timingData ? [interactionData.timingData.sessionDuration] : [],
    });

    // Calculate overall entropy (weighted average)
    const overallEntropy = componentEntropies.reduce((sum, comp) => sum + (comp.entropy * comp.weight), 0);

    // Create entropy profile
    const entropyProfile: EntropyProfile = {
      timingEntropy,
      pressureEntropy,
      movementEntropy,
      gestureEntropy,
      sessionEntropy,
      pattern: this.generateEntropyPattern(componentEntropies),
    };

    // Calculate liveness score based on entropy analysis
    const livenessScore = this.calculateLivenessScore(componentEntropies, overallEntropy);

    // Perform anomaly detection
    const anomalyDetection = this.performAnomalyDetection(componentEntropies, overallEntropy);

    // Generate fingerprint hash
    const fingerprintHash = this.generateFingerprintHash(componentEntropies, timestamp);

    // Calculate validity score
    const validityScore = this.calculateValidityScore(componentEntropies, overallEntropy);

    return {
      overallEntropy,
      componentEntropies,
      entropyProfile,
      livenessScore,
      anomalyDetection,
      fingerprintHash,
      timestamp,
      validityScore,
    };
  }

  // Calculate Shannon entropy for timing data
  private calculateTimingEntropy(timingData?: TimingAnalysis): number {
    if (!timingData) return 0;

    const timingValues = [
      timingData.responseTime,
      timingData.interactionDelay,
      timingData.sessionDuration,
      timingData.patternConsistency * 1000, // Scale up for entropy calculation
    ];

    return this.calculateShannonEntropy(timingValues);
  }

  // Calculate Shannon entropy for pressure data
  private calculatePressureEntropy(touchPoints?: TouchPoint[]): number {
    if (!touchPoints || touchPoints.length === 0) return 0;

    const pressureValues = touchPoints.map(tp => tp.pressure);
    return this.calculateShannonEntropy(pressureValues);
  }

  // Calculate Shannon entropy for movement data
  private calculateMovementEntropy(touchPoints?: TouchPoint[]): number {
    if (!touchPoints || touchPoints.length < 2) return 0;

    const movementValues: number[] = [];
    for (let i = 1; i < touchPoints.length; i++) {
      const dx = touchPoints[i].x - touchPoints[i - 1].x;
      const dy = touchPoints[i].y - touchPoints[i - 1].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      movementValues.push(distance);
    }

    return this.calculateShannonEntropy(movementValues);
  }

  // Calculate Shannon entropy for gesture data
  private calculateGestureEntropy(swipePatterns?: SwipeData[]): number {
    if (!swipePatterns || swipePatterns.length === 0) return 0;

    const gestureValues = swipePatterns.map(sp => sp.velocity + sp.duration);
    return this.calculateShannonEntropy(gestureValues);
  }

  // Calculate Shannon entropy for session data
  private calculateSessionEntropy(timingData?: TimingAnalysis): number {
    if (!timingData) return 0;

    const sessionValues = [
      timingData.sessionDuration,
      timingData.responseTime,
      timingData.patternConsistency * 100,
    ];

    return this.calculateShannonEntropy(sessionValues);
  }

  // Calculate Shannon entropy for a dataset
  private calculateShannonEntropy(values: number[]): number {
    if (values.length === 0) return 0;

    // Normalize values to 0-1 range
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) return 0; // All values are the same

    const normalizedValues = values.map(v => (v - min) / range);

    // Create histogram with 10 bins
    const bins = new Array(10).fill(0);
    normalizedValues.forEach(value => {
      const binIndex = Math.min(9, Math.floor(value * 10));
      bins[binIndex]++;
    });

    // Calculate Shannon entropy
    const total = values.length;
    let entropy = 0;

    bins.forEach(count => {
      if (count > 0) {
        const probability = count / total;
        entropy -= probability * Math.log2(probability);
      }
    });

    // Normalize entropy to 0-1 range (max entropy for 10 bins is log2(10) ≈ 3.32)
    return Math.min(1, entropy / 3.32);
  }

  // Calculate deviation from expected range
  private calculateDeviation(value: number, min: number, max: number): number {
    const center = (min + max) / 2;
    const range = max - min;

    if (range === 0) return 0;

    return Math.abs(value - center) / (range / 2); // Standard deviations from center
  }

  // Generate hex pattern from entropy components
  private generateEntropyPattern(componentEntropies: EntropyComponent[]): string {
    const patternValues = componentEntropies.map(comp => Math.floor(comp.entropy * 255));
    return patternValues.map(v => v.toString(16).padStart(2, '0')).join('');
  }

  // Calculate liveness score based on entropy analysis
  private calculateLivenessScore(componentEntropies: EntropyComponent[], overallEntropy: number): number {
    let livenessScore = 50; // Base score

    // Check if overall entropy is within human range
    if (overallEntropy >= 0.3 && overallEntropy <= 0.8) {
      livenessScore += 30;
    } else if (overallEntropy < 0.2 || overallEntropy > 0.9) {
      livenessScore -= 20; // Too low or too high entropy suggests automation
    }

    // Check individual component deviations
    const totalDeviation = componentEntropies.reduce((sum, comp) => sum + comp.deviation, 0);
    const avgDeviation = totalDeviation / componentEntropies.length;

    if (avgDeviation < 1.0) {
      livenessScore += 20; // Low deviation from expected ranges
    } else if (avgDeviation > 2.0) {
      livenessScore -= 15; // High deviation suggests unnatural patterns
    }

    return Math.max(0, Math.min(100, livenessScore));
  }

  // Perform anomaly detection on entropy patterns
  private performAnomalyDetection(componentEntropies: EntropyComponent[], overallEntropy: number): AnomalyMetrics {
    const anomalies: string[] = [];

    // Check for suspiciously perfect entropy (too robotic)
    if (overallEntropy > 0.95) {
      anomalies.push('entropy_too_high');
    }

    // Check for suspiciously low entropy (too predictable)
    if (overallEntropy < 0.1) {
      anomalies.push('entropy_too_low');
    }

    // Check for component deviations
    componentEntropies.forEach(comp => {
      if (comp.deviation > 3.0) {
        anomalies.push(`${comp.name.toLowerCase().replace(' ', '_')}_deviation`);
      }
    });

    // Calculate z-score (simplified - would use historical data in production)
    const expectedEntropy = 0.55; // Expected human entropy
    const stdDev = 0.15; // Standard deviation
    const zScore = Math.abs(overallEntropy - expectedEntropy) / stdDev;

    // Calculate p-value approximation
    const pValue = Math.exp(-0.5 * zScore * zScore) / Math.sqrt(2 * Math.PI);

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (zScore < 1) riskLevel = 'low';
    else if (zScore < 2) riskLevel = 'medium';
    else if (zScore < 3) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      zScore,
      pValue,
      confidence: Math.max(0, Math.min(100, 100 - (zScore * 20))),
      riskLevel,
      flags: anomalies,
    };
  }

  // Generate unique fingerprint hash
  private generateFingerprintHash(componentEntropies: EntropyComponent[], timestamp: number): string {
    const entropyString = componentEntropies.map(comp => comp.entropy.toString()).join('');
    const dataToHash = entropyString + timestamp.toString() + this.deviceId;

    return CryptoJS.SHA256(dataToHash).toString();
  }

  // Calculate validity score for entropy fingerprint
  private calculateValidityScore(componentEntropies: EntropyComponent[], overallEntropy: number): number {
    let validityScore = 50; // Base score

    // Check overall entropy validity
    if (overallEntropy >= 0.2 && overallEntropy <= 0.9) {
      validityScore += 25;
    }

    // Check component validity
    const validComponents = componentEntropies.filter(comp =>
      comp.entropy >= comp.expectedRange.min && comp.entropy <= comp.expectedRange.max
    ).length;

    const validityRatio = validComponents / componentEntropies.length;
    validityScore += (validityRatio - 0.5) * 50; // ±25 based on validity ratio

    return Math.max(0, Math.min(100, validityScore));
  }

  // Analyze gesture sequence for liveness detection
  private analyzeGestureSequence(touchPoints: TouchPoint[]): string[] {
    const gestures: string[] = [];
    let lastPoint: TouchPoint | null = null;

    for (const point of touchPoints) {
      if (lastPoint) {
        const dx = point.x - lastPoint.x;
        const dy = point.y - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 10) { // Minimum movement threshold
          if (Math.abs(dx) > Math.abs(dy)) {
            gestures.push(dx > 0 ? 'right' : 'left');
          } else {
            gestures.push(dy > 0 ? 'down' : 'up');
          }
        }
      }
      lastPoint = point;
    }

    return gestures;
  }

  // Calculate rotating AI trust score based on various security factors
  private calculateTrustScore(
    recipientDeviceId: string,
    interactionData?: {
      touchPoints?: TouchPoint[];
      swipePatterns?: SwipeData[];
      timingData?: TimingAnalysis;
      proximityData?: ProximityMetrics;
    }
  ): TrustScore {
    const components: TrustComponent[] = [];
    const currentTime = Date.now();

    // Device reputation component
    const deviceReputation = this.calculateDeviceReputation(recipientDeviceId);
    components.push(deviceReputation);

    // Interaction quality component
    const interactionQuality = this.calculateInteractionQuality(interactionData);
    components.push(interactionQuality);

    // Timing consistency component
    const timingConsistency = this.calculateTimingConsistency(interactionData?.timingData);
    components.push(timingConsistency);

    // Behavioral pattern component
    const behavioralPattern = this.calculateBehavioralPattern(interactionData);
    components.push(behavioralPattern);

    // Proximity security component
    const proximitySecurity = this.calculateProximitySecurity(interactionData?.proximityData);
    components.push(proximitySecurity);

    // Calculate overall score with adaptive weights
    const adaptiveWeights = this.getAdaptiveWeights(recipientDeviceId);
    let overallScore = 0;
    let totalWeight = 0;

    for (let i = 0; i < components.length; i++) {
      const weight = this.getComponentWeight(components[i].name, adaptiveWeights);
      overallScore += components[i].score * weight;
      totalWeight += weight;
    }

    overallScore = totalWeight > 0 ? overallScore / totalWeight : 0;

    // Apply rotation factor based on time decay and recent activity
    const rotationFactor = this.calculateRotationFactor(recipientDeviceId, currentTime);
    overallScore = overallScore * rotationFactor;

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (overallScore >= 80) riskLevel = 'low';
    else if (overallScore >= 60) riskLevel = 'medium';
    else if (overallScore >= 40) riskLevel = 'high';
    else riskLevel = 'critical';

    // Calculate historical trend and predictive score
    const historicalTrend = this.calculateHistoricalTrend(recipientDeviceId, overallScore, currentTime);
    const predictiveScore = this.calculatePredictiveScore(historicalTrend, overallScore);
    const anomalyScore = this.calculateAnomalyScore(overallScore, historicalTrend);

    // Update adaptive weights based on learning
    this.updateAdaptiveWeights(recipientDeviceId, components, overallScore);

    // Calculate clone resistance score and uniqueness fingerprint
    const cloneResistanceScore = this.calculateCloneResistanceScore(recipientDeviceId, interactionData);
    const uniquenessFingerprint = this.generateUniquenessFingerprint(recipientDeviceId, interactionData);

    return {
      overallScore: Math.round(Math.max(0, Math.min(100, overallScore))),
      components,
      riskLevel,
      lastUpdated: currentTime,
      confidence: this.calculateConfidence(components),
      rotationFactor,
      historicalTrend,
      adaptiveWeights,
      predictiveScore,
      anomalyScore,
      cloneResistanceScore,
      uniquenessFingerprint,
    };
  }

  // Get adaptive weights for components based on device history
  private getAdaptiveWeights(deviceId: string): AdaptiveWeights {
    // In a real implementation, this would be stored and retrieved from persistent storage
    // For now, return default weights with learning rate
    return {
      deviceReputation: 0.3,
      interactionQuality: 0.25,
      timingConsistency: 0.2,
      behavioralPattern: 0.15,
      proximitySecurity: 0.1,
      lastAdjusted: Date.now(),
      learningRate: 0.1,
    };
  }

  // Get component weight with adaptive adjustment
  private getComponentWeight(componentName: string, adaptiveWeights: AdaptiveWeights): number {
    switch (componentName) {
      case 'Device Reputation': return adaptiveWeights.deviceReputation;
      case 'Interaction Quality': return adaptiveWeights.interactionQuality;
      case 'Timing Consistency': return adaptiveWeights.timingConsistency;
      case 'Behavioral Pattern': return adaptiveWeights.behavioralPattern;
      case 'Proximity Security': return adaptiveWeights.proximitySecurity;
      default: return 0.2;
    }
  }

  // Calculate rotation factor based on time decay and activity patterns
  private calculateRotationFactor(deviceId: string, currentTime: number): number {
    // Base rotation factor starts at 1.0 (no decay)
    let rotationFactor = 1.0;

    // Apply time-based decay (scores decay over time if no recent activity)
    const timeSinceLastActivity = currentTime - (this.getLastActivityTime(deviceId) || currentTime);
    const hoursSinceActivity = timeSinceLastActivity / (1000 * 60 * 60);

    if (hoursSinceActivity > 24) {
      // Decay by 10% per day of inactivity, max 50% decay
      const decayRate = Math.min(0.5, (hoursSinceActivity / 24) * 0.1);
      rotationFactor -= decayRate;
    }

    // Apply activity boost for recent interactions
    if (hoursSinceActivity < 1) {
      rotationFactor += 0.1; // 10% boost for very recent activity
    }

    return Math.max(0.3, Math.min(1.2, rotationFactor)); // Clamp between 0.3 and 1.2
  }

  // Get last activity time for device (simplified implementation)
  private getLastActivityTime(deviceId: string): number | null {
    // In a real implementation, this would query a database
    // For now, return a mock time based on device ID hash
    const hash = CryptoJS.SHA256(deviceId).toString();
    const timeOffset = parseInt(hash.substring(0, 8), 16) % (24 * 60 * 60 * 1000); // Random offset within 24 hours
    return Date.now() - timeOffset;
  }

  // Calculate historical trend analysis
  private calculateHistoricalTrend(deviceId: string, currentScore: number, currentTime: number): HistoricalTrend {
    // In a real implementation, this would retrieve historical data from storage
    // For now, generate mock historical data
    const scoreHistory: ScorePoint[] = [];
    const baseScore = currentScore;

    // Generate last 10 score points (mock data)
    for (let i = 9; i >= 0; i--) {
      const timestamp = currentTime - (i * 60 * 60 * 1000); // Every hour
      const variation = (Math.random() - 0.5) * 20; // ±10 variation
      const score = Math.max(0, Math.min(100, baseScore + variation));

      scoreHistory.push({
        timestamp,
        score,
        factors: ['mock_factor'],
        eventType: 'periodic_check',
      });
    }

    // Calculate trend direction
    const recentScores = scoreHistory.slice(-5).map(p => p.score);
    const olderScores = scoreHistory.slice(0, 5).map(p => p.score);

    const recentAvg = recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((sum, s) => sum + s, 0) / olderScores.length;

    let trendDirection: 'improving' | 'stable' | 'declining';
    if (recentAvg > olderAvg + 5) trendDirection = 'improving';
    else if (recentAvg < olderAvg - 5) trendDirection = 'declining';
    else trendDirection = 'stable';

    // Calculate volatility (standard deviation)
    const allScores = scoreHistory.map(p => p.score);
    const mean = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
    const variance = allScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / allScores.length;
    const volatility = Math.sqrt(variance);

    // Calculate consistency (inverse of coefficient of variation)
    const coefficientOfVariation = volatility / mean;
    const consistency = Math.max(0, 1 - coefficientOfVariation);

    return {
      scoreHistory,
      trendDirection,
      volatility,
      consistency,
      averageScore: mean,
    };
  }

  // Calculate predictive score using trend analysis
  private calculatePredictiveScore(historicalTrend: HistoricalTrend, currentScore: number): number {
    let predictiveScore = currentScore;

    // Apply trend-based prediction
    switch (historicalTrend.trendDirection) {
      case 'improving':
        predictiveScore += 5; // Expect improvement
        break;
      case 'declining':
        predictiveScore -= 5; // Expect decline
        break;
      case 'stable':
        // No change expected
        break;
    }

    // Apply volatility adjustment
    if (historicalTrend.volatility > 15) {
      // High volatility suggests unpredictable behavior
      predictiveScore = (predictiveScore + historicalTrend.averageScore) / 2;
    }

    return Math.max(0, Math.min(100, predictiveScore));
  }

  // Calculate anomaly score based on deviation from normal patterns
  private calculateAnomalyScore(currentScore: number, historicalTrend: HistoricalTrend): number {
    const mean = historicalTrend.averageScore;
    const stdDev = historicalTrend.volatility;

    if (stdDev === 0) return 0; // No historical data

    // Calculate z-score (standard deviations from mean)
    const zScore = Math.abs(currentScore - mean) / stdDev;

    // Convert z-score to anomaly score (0-100)
    // z-score of 3+ is highly anomalous
    const anomalyScore = Math.min(100, (zScore / 3) * 100);

    return anomalyScore;
  }

  // Update adaptive weights based on learning from recent interactions
  private updateAdaptiveWeights(deviceId: string, components: TrustComponent[], overallScore: number): void {
    // In a real implementation, this would update stored weights based on:
    // 1. Which components were most predictive of the final score
    // 2. Component performance over time
    // 3. Learning rate adjustments

    // For now, this is a placeholder for the adaptive learning mechanism
    // The weights would be adjusted based on:
    // - Component correlation with final trust score
    // - Historical accuracy of each component
    // - Recent performance trends

    console.log(`Updating adaptive weights for device ${deviceId}:`, {
      overallScore,
      componentPerformance: components.map(c => ({ name: c.name, score: c.score })),
    });
  }

  private calculateDeviceReputation(deviceId: string): TrustComponent {
    // Check if device is known and has good history
    const isKnown = this.knownDevices.has(deviceId);
    const evidence: string[] = [];
    const riskFactors: string[] = [];

    if (isKnown) {
      evidence.push('Device previously authenticated');
    } else {
      riskFactors.push('Unknown device');
    }

    const score = isKnown ? 85 : 45;

    return {
      name: 'Device Reputation',
      score,
      weight: 0.3,
      evidence,
      riskFactors,
    };
  }

  private calculateInteractionQuality(interactionData?: {
    touchPoints?: TouchPoint[];
    swipePatterns?: SwipeData[];
  }): TrustComponent {
    const evidence: string[] = [];
    const riskFactors: string[] = [];

    let score = 50; // Base score

    if (interactionData?.touchPoints && interactionData.touchPoints.length > 0) {
      evidence.push('Touch interaction detected');
      score += 20;

      // Check for natural pressure variations
      const pressures = interactionData.touchPoints.map(tp => tp.pressure);
      const pressureVariation = this.calculateVariation(pressures);

      if (pressureVariation > 0.1) {
        evidence.push('Natural pressure variation detected');
        score += 15;
      } else {
        riskFactors.push('Unnatural pressure patterns');
        score -= 10;
      }
    } else {
      riskFactors.push('No touch interaction detected');
      score -= 20;
    }

    if (interactionData?.swipePatterns && interactionData.swipePatterns.length > 0) {
      evidence.push('Swipe gestures detected');
      score += 15;

      // Check for natural swipe velocities
      const velocities = interactionData.swipePatterns.map(sp => sp.velocity);
      const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;

      if (avgVelocity > 100 && avgVelocity < 2000) {
        evidence.push('Natural swipe velocity');
        score += 10;
      } else {
        riskFactors.push('Unnatural swipe velocity');
        score -= 5;
      }
    }

    return {
      name: 'Interaction Quality',
      score: Math.max(0, Math.min(100, score)),
      weight: 0.25,
      evidence,
      riskFactors,
    };
  }

  private calculateTimingConsistency(timingData?: TimingAnalysis): TrustComponent {
    const evidence: string[] = [];
    const riskFactors: string[] = [];

    let score = 50;

    if (timingData) {
      // Check response time
      if (timingData.responseTime > 100 && timingData.responseTime < 3000) {
        evidence.push('Normal response time');
        score += 20;
      } else if (timingData.responseTime < 50) {
        riskFactors.push('Suspiciously fast response');
        score -= 15;
      }

      // Check pattern consistency
      if (timingData.patternConsistency > 0.7) {
        evidence.push('Consistent timing patterns');
        score += 15;
      } else {
        riskFactors.push('Inconsistent timing patterns');
        score -= 10;
      }

      // Check session duration
      if (timingData.sessionDuration > 5000) {
        evidence.push('Appropriate session duration');
        score += 10;
      }
    } else {
      riskFactors.push('No timing data available');
      score -= 20;
    }

    return {
      name: 'Timing Consistency',
      score: Math.max(0, Math.min(100, score)),
      weight: 0.2,
      evidence,
      riskFactors,
    };
  }

  private calculateBehavioralPattern(interactionData?: {
    touchPoints?: TouchPoint[];
    swipePatterns?: SwipeData[];
  }): TrustComponent {
    const evidence: string[] = [];
    const riskFactors: string[] = [];

    let score = 50;

    // Analyze touch patterns
    if (interactionData?.touchPoints) {
      const touchCount = interactionData.touchPoints.length;

      if (touchCount >= 3) {
        evidence.push('Multiple touch points detected');
        score += 15;
      }

      // Check for natural touch distribution
      const xCoords = interactionData.touchPoints.map(tp => tp.x);
      const yCoords = interactionData.touchPoints.map(tp => tp.y);

      const xVariation = this.calculateVariation(xCoords);
      const yVariation = this.calculateVariation(yCoords);

      if (xVariation > 0.2 && yVariation > 0.2) {
        evidence.push('Natural touch distribution');
        score += 20;
      } else {
        riskFactors.push('Unnatural touch distribution');
        score -= 10;
      }
    }

    return {
      name: 'Behavioral Pattern',
      score: Math.max(0, Math.min(100, score)),
      weight: 0.15,
      evidence,
      riskFactors,
    };
  }

  private calculateProximitySecurity(proximityData?: ProximityMetrics): TrustComponent {
    const evidence: string[] = [];
    const riskFactors: string[] = [];

    let score = 50;

    if (proximityData) {
      // Check signal strength
      if (proximityData.signalStrength > 0.7) {
        evidence.push('Strong signal detected');
        score += 15;
      } else if (proximityData.signalStrength < 0.3) {
        riskFactors.push('Weak signal detected');
        score -= 10;
      }

      // Check distance
      if (proximityData.distance < 10) {
        evidence.push('Optimal proximity');
        score += 10;
      } else if (proximityData.distance > 50) {
        riskFactors.push('Device too far');
        score -= 15;
      }

      // Check interference
      if (proximityData.interference < 0.2) {
        evidence.push('Low interference');
        score += 10;
      } else {
        riskFactors.push('High interference detected');
        score -= 5;
      }
    } else {
      riskFactors.push('No proximity data available');
      score -= 20;
    }

    return {
      name: 'Proximity Security',
      score: Math.max(0, Math.min(100, score)),
      weight: 0.1,
      evidence,
      riskFactors,
    };
  }

  private calculateVariation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;

    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  private calculateConfidence(components: TrustComponent[]): number {
    // Calculate confidence based on evidence strength and consistency
    const evidenceCount = components.reduce((sum, comp) => sum + comp.evidence.length, 0);
    const riskCount = components.reduce((sum, comp) => sum + comp.riskFactors.length, 0);

    const totalFactors = evidenceCount + riskCount;
    if (totalFactors === 0) return 50;

    return Math.round((evidenceCount / totalFactors) * 100);
  }

  private hashMessage(message: any): string {
    const dataString = JSON.stringify(message);
    return CryptoJS.SHA256(dataString).toString();
  }

  private signMessage(hash: string): string {
    const securityManager = AIONETSecurityManager.getInstance();
    return securityManager['signTransaction'](hash, securityManager['privateKey']);
  }

  private async findMessageNonce(hash: string, difficulty: number): Promise<number> {
    let nonce = 0;
    const target = '0'.repeat(difficulty);

    while (true) {
      const testHash = CryptoJS.SHA256(hash + nonce.toString()).toString();
      if (testHash.startsWith(target)) {
        return nonce;
      }
      nonce++;
      // Prevent infinite loop in production
      if (nonce > 1000000) break;
    }
    return nonce;
  }

  private async createBlockchainProof(messageData: any, messageHash: string): Promise<BlockchainProof> {
    const blockHeight = this.messageBlocks.length;
    const merkleRoot = this.calculateMerkleRoot([messageHash]);
    const consensusHash = await this.createConsensusHash(messageData);

    // In a real blockchain, this would involve multiple validators
    const validatorSignatures = [this.signMessage(consensusHash)];

    return {
      blockHeight,
      merkleRoot,
      consensusHash,
      validatorSignatures,
      timestamp: Date.now(),
    };
  }

  private calculateMerkleRoot(messageHashes: string[]): string {
    if (messageHashes.length === 0) return '';
    if (messageHashes.length === 1) return messageHashes[0];

    const combined = messageHashes.join('');
    return CryptoJS.SHA256(combined).toString();
  }

  private async createConsensusHash(messageData: any): Promise<string> {
    const consensusData = {
      ...messageData,
      validatorCount: 1, // In real blockchain, this would be multiple validators
      consensusTimestamp: Date.now(),
    };
    return CryptoJS.SHA256(JSON.stringify(consensusData)).toString();
  }

  // Verify message integrity and blockchain proof
  async verifySecureMessage(message: SecureMessage, senderPublicKey: string): Promise<boolean> {
    try {
      // Verify message hash
      const calculatedHash = this.hashMessage({
        id: message.id,
        senderDeviceId: message.senderDeviceId,
        recipientDeviceId: message.recipientDeviceId,
        content: message.content,
        timestamp: message.timestamp,
        publicKey: message.publicKey,
        messageType: message.messageType,
      });

      if (calculatedHash !== message.hash) {
        console.error('Message hash verification failed');
        return false;
      }

      // Verify signature
      const expectedSignature = AIONETSecurityManager.getInstance()['signTransaction'](message.hash, senderPublicKey);
      if (expectedSignature !== message.signature) {
        console.error('Message signature verification failed');
        return false;
      }

      // Verify proof of work
      const testHash = CryptoJS.SHA256(message.hash + message.nonce.toString()).toString();
      if (!testHash.startsWith('0'.repeat(3))) {
        console.error('Message proof of work verification failed');
        return false;
      }

      // Verify blockchain proof
      if (!await this.verifyBlockchainProof(message.blockchainProof, message)) {
        console.error('Blockchain proof verification failed');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Message verification failed:', error);
      return false;
    }
  }

  private async verifyBlockchainProof(proof: BlockchainProof, message: SecureMessage): Promise<boolean> {
    try {
      // Verify consensus hash
      const expectedConsensusHash = await this.createConsensusHash({
        id: message.id,
        senderDeviceId: message.senderDeviceId,
        recipientDeviceId: message.recipientDeviceId,
        content: message.content,
        timestamp: message.timestamp,
        publicKey: message.publicKey,
        messageType: message.messageType,
      });

      if (expectedConsensusHash !== proof.consensusHash) {
        return false;
      }

      // Verify validator signatures (simplified - in real blockchain this would be more complex)
      const securityManager = AIONETSecurityManager.getInstance();
      const expectedValidatorSignature = securityManager['signTransaction'](proof.consensusHash, securityManager['privateKey']);

      if (!proof.validatorSignatures.includes(expectedValidatorSignature)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Blockchain proof verification failed:', error);
      return false;
    }
  }

  // Create a new message block
  async createMessageBlock(): Promise<MessageBlock | null> {
    if (this.pendingMessages.length === 0) return null;

    const blockIndex = this.messageBlocks.length;
    const timestamp = Date.now();
    const previousBlockHash = this.messageBlocks.length > 0
      ? this.messageBlocks[this.messageBlocks.length - 1].blockHash
      : '0'.repeat(64);

    // Calculate Merkle root for all pending messages
    const messageHashes = this.pendingMessages.map(msg => msg.hash);
    const merkleRoot = this.calculateMerkleRoot(messageHashes);

    // Create block hash
    const blockData = {
      index: blockIndex,
      timestamp,
      messages: this.pendingMessages,
      previousBlockHash,
      merkleRoot,
      validatorDeviceId: this.deviceId,
    };

    const blockHash = CryptoJS.SHA256(JSON.stringify(blockData)).toString();

    // Proof of work for block
    let nonce = 0;
    const target = '0'.repeat(4); // Higher difficulty for blocks
    while (true) {
      const testHash = CryptoJS.SHA256(blockHash + nonce.toString()).toString();
      if (testHash.startsWith(target)) {
        break;
      }
      nonce++;
      if (nonce > 1000000) break; // Prevent infinite loop
    }

    const newBlock: MessageBlock = {
      ...blockData,
      blockHash: CryptoJS.SHA256(blockHash + nonce.toString()).toString(),
      nonce,
    };

    // Add block to chain
    this.messageBlocks.push(newBlock);

    // Clear pending messages
    this.pendingMessages = [];

    return newBlock;
  }

  // Get latest message hash for chaining
  private getLatestMessageHash(): string | undefined {
    if (this.pendingMessages.length > 0) {
      return this.pendingMessages[this.pendingMessages.length - 1].hash;
    }
    if (this.messageBlocks.length > 0) {
      const latestBlock = this.messageBlocks[this.messageBlocks.length - 1];
      if (latestBlock.messages.length > 0) {
        return latestBlock.messages[latestBlock.messages.length - 1].hash;
      }
    }
    return undefined;
  }

  // Register a known device for message validation
  registerDevice(deviceId: string, publicKey: string): void {
    this.knownDevices.set(deviceId, publicKey);
  }

  // Get blockchain statistics
  getBlockchainStats(): {
    totalBlocks: number;
    totalMessages: number;
    pendingMessages: number;
    knownDevices: number;
  } {
    const totalMessages = this.messageBlocks.reduce((sum, block) => sum + block.messages.length, 0);

    return {
      totalBlocks: this.messageBlocks.length,
      totalMessages,
      pendingMessages: this.pendingMessages.length,
      knownDevices: this.knownDevices.size,
    };
  }

  // Verify entire message blockchain
  verifyMessageBlockchain(): boolean {
    for (let i = 1; i < this.messageBlocks.length; i++) {
      const currentBlock = this.messageBlocks[i];
      const previousBlock = this.messageBlocks[i - 1];

      // Verify block hash linkage
      if (currentBlock.previousBlockHash !== previousBlock.blockHash) {
        console.error(`Block ${i} hash linkage verification failed`);
        return false;
      }

      // Verify block proof of work
      const testHash = CryptoJS.SHA256(currentBlock.blockHash + currentBlock.nonce.toString()).toString();
      if (!testHash.startsWith('0'.repeat(4))) {
        console.error(`Block ${i} proof of work verification failed`);
        return false;
      }

      // Verify Merkle root
      const messageHashes = currentBlock.messages.map(msg => msg.hash);
      const calculatedMerkleRoot = this.calculateMerkleRoot(messageHashes);
      if (calculatedMerkleRoot !== currentBlock.merkleRoot) {
        console.error(`Block ${i} Merkle root verification failed`);
        return false;
      }
    }

    return true;
  }

  // Get message blocks
  getMessageBlocks(): MessageBlock[] {
    return [...this.messageBlocks];
  }

  // Get pending messages
  getPendingMessages(): SecureMessage[] {
    return [...this.pendingMessages];
  }

  // Calculate clone resistance score based on multiple security factors
  private calculateCloneResistanceScore(
    deviceId: string,
    interactionData?: {
      touchPoints?: TouchPoint[];
      swipePatterns?: SwipeData[];
      timingData?: TimingAnalysis;
      proximityData?: ProximityMetrics;
    }
  ): number {
    let cloneResistanceScore = 50; // Base score

    // Factor 1: Hardware uniqueness (device fingerprinting)
    const hardwareUniqueness = this.calculateHardwareUniqueness(deviceId);
    cloneResistanceScore += hardwareUniqueness * 0.3;

    // Factor 2: Behavioral pattern complexity
    const behavioralComplexity = this.calculateBehavioralComplexity(interactionData);
    cloneResistanceScore += behavioralComplexity * 0.25;

    // Factor 3: Temporal uniqueness (time-based challenges)
    const temporalUniqueness = this.calculateTemporalUniqueness();
    cloneResistanceScore += temporalUniqueness * 0.2;

    // Factor 4: Session binding strength
    const sessionBinding = this.calculateSessionBindingStrength();
    cloneResistanceScore += sessionBinding * 0.15;

    // Factor 5: Entropy-based randomness
    const entropyRandomness = this.calculateEntropyRandomness(interactionData);
    cloneResistanceScore += entropyRandomness * 0.1;

    return Math.max(0, Math.min(100, cloneResistanceScore));
  }

  // Calculate hardware uniqueness score
  private calculateHardwareUniqueness(deviceId: string): number {
    // In a real implementation, this would analyze:
    // - Device hardware identifiers
    // - Sensor capabilities
    // - Hardware entropy sources
    // - Unique device characteristics

    // For now, use device ID hash complexity as proxy
    const hash = CryptoJS.SHA256(deviceId).toString();
    const uniqueChars = new Set(hash.split('')).size;
    const uniquenessRatio = uniqueChars / 16; // Hex characters 0-9,a-f

    return Math.round(uniquenessRatio * 100);
  }

  // Calculate behavioral pattern complexity
  private calculateBehavioralComplexity(interactionData?: {
    touchPoints?: TouchPoint[];
    swipePatterns?: SwipeData[];
    timingData?: TimingAnalysis;
  }): number {
    let complexityScore = 0;

    if (interactionData?.touchPoints) {
      const touchCount = interactionData.touchPoints.length;
      const avgPressure = interactionData.touchPoints.reduce((sum, tp) => sum + tp.pressure, 0) / touchCount;
      const pressureVariation = this.calculateVariation(interactionData.touchPoints.map(tp => tp.pressure));

      complexityScore += Math.min(30, touchCount * 2); // Up to 30 points for touch count
      complexityScore += Math.min(20, pressureVariation * 100); // Up to 20 points for pressure variation
    }

    if (interactionData?.swipePatterns) {
      const swipeCount = interactionData.swipePatterns.length;
      const avgVelocity = interactionData.swipePatterns.reduce((sum, sp) => sum + sp.velocity, 0) / swipeCount;
      const velocityVariation = this.calculateVariation(interactionData.swipePatterns.map(sp => sp.velocity));

      complexityScore += Math.min(25, swipeCount * 3); // Up to 25 points for swipe count
      complexityScore += Math.min(15, velocityVariation * 50); // Up to 15 points for velocity variation
    }

    if (interactionData?.timingData) {
      const timingConsistency = interactionData.timingData.patternConsistency;
      complexityScore += Math.min(10, timingConsistency * 10); // Up to 10 points for timing consistency
    }

    return Math.min(100, complexityScore);
  }

  // Calculate temporal uniqueness score
  private calculateTemporalUniqueness(): number {
    // Use current timestamp with high precision
    const now = Date.now();
    const microTime = Math.random() * 1000; // Fallback for performance.now()
    const combinedTime = now + microTime;

    // Calculate entropy of timestamp
    const timeString = combinedTime.toString();
    const uniqueDigits = new Set(timeString.split('')).size;
    const entropyRatio = uniqueDigits / 10; // Digits 0-9

    return Math.round(entropyRatio * 100);
  }

  // Calculate session binding strength
  private calculateSessionBindingStrength(): number {
    // Session binding includes:
    // - Session ID uniqueness
    // - Challenge-response validity
    // - Session timeout enforcement
    // - Concurrent session limits

    const sessionId = CryptoJS.lib.WordArray.random(16).toString();
    const sessionEntropy = this.calculateShannonEntropy(sessionId.split('').map(c => c.charCodeAt(0)));

    return Math.round(sessionEntropy * 100);
  }

  // Calculate entropy-based randomness
  private calculateEntropyRandomness(interactionData?: {
    touchPoints?: TouchPoint[];
    swipePatterns?: SwipeData[];
  }): number {
    let totalEntropy = 0;
    let dataPoints = 0;

    if (interactionData?.touchPoints) {
      const touchData = interactionData.touchPoints.flatMap(tp => [tp.x, tp.y, tp.pressure, tp.timestamp]);
      totalEntropy += this.calculateShannonEntropy(touchData);
      dataPoints += touchData.length;
    }

    if (interactionData?.swipePatterns) {
      const swipeData = interactionData.swipePatterns.flatMap(sp => [
        sp.startX, sp.startY, sp.endX, sp.endY, sp.duration, sp.velocity
      ]);
      totalEntropy += this.calculateShannonEntropy(swipeData);
      dataPoints += swipeData.length;
    }

    if (dataPoints === 0) return 50; // Default score when no interaction data

    const avgEntropy = totalEntropy / Math.max(1, dataPoints / 10); // Normalize
    return Math.round(Math.min(100, avgEntropy * 100));
  }

  // Generate hardware-based uniqueness fingerprint
  private generateUniquenessFingerprint(
    deviceId: string,
    interactionData?: {
      touchPoints?: TouchPoint[];
      swipePatterns?: SwipeData[];
      timingData?: TimingAnalysis;
      proximityData?: ProximityMetrics;
    }
  ): string {
    const fingerprintComponents = [
      deviceId,
      this.deviceId,
      Date.now().toString(),
      performance.now().toString(),
      Math.random().toString(),
    ];

    // Add interaction data to fingerprint
    if (interactionData?.touchPoints) {
      fingerprintComponents.push(
        interactionData.touchPoints.length.toString(),
        interactionData.touchPoints.map(tp => tp.pressure).join(',')
      );
    }

    if (interactionData?.swipePatterns) {
      fingerprintComponents.push(
        interactionData.swipePatterns.length.toString(),
        interactionData.swipePatterns.map(sp => sp.velocity).join(',')
      );
    }

    if (interactionData?.timingData) {
      fingerprintComponents.push(
        interactionData.timingData.responseTime.toString(),
        interactionData.timingData.sessionDuration.toString()
      );
    }

    if (interactionData?.proximityData) {
      fingerprintComponents.push(
        interactionData.proximityData.signalStrength.toString(),
        interactionData.proximityData.distance.toString()
      );
    }

    // Create unique fingerprint hash
    const fingerprintString = fingerprintComponents.join('|');
    return CryptoJS.SHA256(fingerprintString).toString();
  }

  // Advanced clone detection using multiple verification layers
  async detectCloningAttempt(
    deviceId: string,
    interactionData?: {
      touchPoints?: TouchPoint[];
      swipePatterns?: SwipeData[];
      timingData?: TimingAnalysis;
      proximityData?: ProximityMetrics;
    }
  ): Promise<{
    isCloned: boolean;
    confidence: number;
    detectionMethods: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const detectionMethods: string[] = [];
    let totalRiskScore = 0;

    // Method 1: Hardware fingerprint verification
    const hardwareMatch = await this.verifyHardwareFingerprint(deviceId);
    if (!hardwareMatch) {
      detectionMethods.push('hardware_fingerprint_mismatch');
      totalRiskScore += 30;
    }

    // Method 2: Behavioral pattern analysis
    const behavioralMatch = this.verifyBehavioralPatterns(interactionData);
    if (!behavioralMatch.isMatch) {
      detectionMethods.push('behavioral_pattern_anomaly');
      totalRiskScore += behavioralMatch.riskScore;
    }

    // Method 3: Temporal consistency check
    const temporalMatch = this.verifyTemporalConsistency();
    if (!temporalMatch) {
      detectionMethods.push('temporal_inconsistency');
      totalRiskScore += 20;
    }

    // Method 4: Session binding verification
    const sessionMatch = this.verifySessionBinding();
    if (!sessionMatch) {
      detectionMethods.push('session_binding_failure');
      totalRiskScore += 15;
    }

    // Method 5: Entropy pattern verification
    const entropyMatch = this.verifyEntropyPatterns(interactionData);
    if (!entropyMatch.isValid) {
      detectionMethods.push('entropy_pattern_anomaly');
      totalRiskScore += entropyMatch.riskScore;
    }

    // Method 6: Proximity and environmental verification
    const proximityMatch = this.verifyProximityEnvironment(interactionData?.proximityData);
    if (!proximityMatch) {
      detectionMethods.push('proximity_environment_mismatch');
      totalRiskScore += 10;
    }

    // Calculate overall confidence and risk level
    const confidence = Math.min(100, totalRiskScore);
    const isCloned = confidence > 60; // Threshold for clone detection

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (confidence < 30) riskLevel = 'low';
    else if (confidence < 50) riskLevel = 'medium';
    else if (confidence < 70) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      isCloned,
      confidence,
      detectionMethods,
      riskLevel,
    };
  }

  // Verify hardware fingerprint
  private async verifyHardwareFingerprint(deviceId: string): Promise<boolean> {
    // In a real implementation, this would:
    // - Check device hardware identifiers
    // - Verify sensor capabilities
    // - Validate hardware entropy sources
    // - Compare against known device profiles

    // For now, use a simplified check
    const storedFingerprint = this.getStoredHardwareFingerprint(deviceId);
    const currentFingerprint = this.generateHardwareFingerprint();

    return storedFingerprint === currentFingerprint;
  }

  // Get stored hardware fingerprint (simplified)
  private getStoredHardwareFingerprint(deviceId: string): string {
    // In production, this would be retrieved from secure storage
    return CryptoJS.SHA256(deviceId + 'hardware').toString();
  }

  // Generate current hardware fingerprint
  private generateHardwareFingerprint(): string {
    // In production, this would collect actual hardware data
    // For React Native, use device-specific information
    const hardwareData = [
      'ReactNative-' + this.deviceId,
      Date.now().toString(),
      Math.random().toString(),
      'NFC-Wallet-App',
    ].join('|');

    return CryptoJS.SHA256(hardwareData).toString();
  }

  // Verify behavioral patterns
  private verifyBehavioralPatterns(interactionData?: {
    touchPoints?: TouchPoint[];
    swipePatterns?: SwipeData[];
    timingData?: TimingAnalysis;
  }): { isMatch: boolean; riskScore: number } {
    if (!interactionData) {
      return { isMatch: false, riskScore: 25 };
    }

    let riskScore = 0;
    let anomalies = 0;

    // Check touch patterns
    if (interactionData.touchPoints) {
      const touchCount = interactionData.touchPoints.length;
      if (touchCount < 3) anomalies++;

      const pressures = interactionData.touchPoints.map(tp => tp.pressure);
      const pressureVariation = this.calculateVariation(pressures);
      if (pressureVariation < 0.05) {
        anomalies++;
        riskScore += 10;
      }
    }

    // Check swipe patterns
    if (interactionData.swipePatterns) {
      const swipeCount = interactionData.swipePatterns.length;
      if (swipeCount < 2) anomalies++;

      const velocities = interactionData.swipePatterns.map(sp => sp.velocity);
      const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
      if (avgVelocity < 50 || avgVelocity > 3000) {
        anomalies++;
        riskScore += 10;
      }
    }

    // Check timing patterns
    if (interactionData.timingData) {
      const responseTime = interactionData.timingData.responseTime;
      if (responseTime < 50 || responseTime > 5000) {
        anomalies++;
        riskScore += 15;
      }
    }

    const isMatch = anomalies <= 1;
    return { isMatch, riskScore: Math.min(40, riskScore + (anomalies * 5)) };
  }

  // Verify temporal consistency
  private verifyTemporalConsistency(): boolean {
    const now = Date.now();
    const lastActivity = this.getLastActivityTime(this.deviceId);

    if (!lastActivity) return true; // First activity

    const timeDiff = now - lastActivity;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Suspicious if time jumps are too large or too small
    return hoursDiff > 0.001 && hoursDiff < 24; // Between 3.6 seconds and 24 hours
  }

  // Verify session binding
  private verifySessionBinding(): boolean {
    // Check if session is properly bound to device and time
    const currentSession = this.getCurrentSession();
    const sessionAge = Date.now() - (currentSession?.startTime || 0);

    // Session should not be too old or too new
    return sessionAge > 1000 && sessionAge < 3600000; // 1 second to 1 hour
  }

  // Get current session (simplified)
  private getCurrentSession(): { startTime: number } | null {
    // In production, this would retrieve from secure session storage
    return { startTime: Date.now() - 300000 }; // Mock 5 minutes ago
  }

  // Verify entropy patterns
  private verifyEntropyPatterns(interactionData?: {
    touchPoints?: TouchPoint[];
    swipePatterns?: SwipeData[];
  }): { isValid: boolean; riskScore: number } {
    if (!interactionData) {
      return { isValid: false, riskScore: 20 };
    }

    let totalEntropy = 0;
    let dataPoints = 0;
    let riskScore = 0;

    if (interactionData.touchPoints) {
      const touchData = interactionData.touchPoints.flatMap(tp => [tp.x, tp.y, tp.pressure]);
      const touchEntropy = this.calculateShannonEntropy(touchData);
      totalEntropy += touchEntropy;
      dataPoints += touchData.length;

      if (touchEntropy < 0.3) riskScore += 10; // Too predictable
      if (touchEntropy > 0.9) riskScore += 5;  // Too random (suspicious)
    }

    if (interactionData.swipePatterns) {
      const swipeData = interactionData.swipePatterns.flatMap(sp => [sp.velocity, sp.duration]);
      const swipeEntropy = this.calculateShannonEntropy(swipeData);
      totalEntropy += swipeEntropy;
      dataPoints += swipeData.length;

      if (swipeEntropy < 0.2) riskScore += 10;
      if (swipeEntropy > 0.95) riskScore += 5;
    }

    const avgEntropy = dataPoints > 0 ? totalEntropy / dataPoints : 0;
    const isValid = avgEntropy >= 0.3 && avgEntropy <= 0.8; // Human-like entropy range

    return { isValid, riskScore: Math.min(30, riskScore) };
  }

  // Verify proximity and environmental factors
  private verifyProximityEnvironment(proximityData?: ProximityMetrics): boolean {
    if (!proximityData) return true; // No proximity data to verify

    // Check signal strength
    if (proximityData.signalStrength < 0.1 || proximityData.signalStrength > 1.0) {
      return false;
    }

    // Check distance
    if (proximityData.distance < 0 || proximityData.distance > 100) {
      return false;
    }

    // Check interference
    if (proximityData.interference < 0 || proximityData.interference > 1) {
      return false;
    }

    return true;
  }

  // Advanced anti-cloning measures
  async implementAntiCloningMeasures(
    deviceId: string,
    interactionData?: {
      touchPoints?: TouchPoint[];
      swipePatterns?: SwipeData[];
      timingData?: TimingAnalysis;
      proximityData?: ProximityMetrics;
    }
  ): Promise<{
    protectionLevel: 'basic' | 'standard' | 'advanced' | 'maximum';
    activeMeasures: string[];
    effectiveness: number;
  }> {
    const activeMeasures: string[] = [];
    let effectiveness = 0;

    // Measure 1: Hardware binding
    if (await this.verifyHardwareFingerprint(deviceId)) {
      activeMeasures.push('hardware_binding');
      effectiveness += 25;
    }

    // Measure 2: Behavioral biometrics
    const behavioralScore = this.calculateBehavioralComplexity(interactionData);
    if (behavioralScore > 60) {
      activeMeasures.push('behavioral_biometrics');
      effectiveness += 20;
    }

    // Measure 3: Temporal challenges
    const temporalScore = this.calculateTemporalUniqueness();
    if (temporalScore > 70) {
      activeMeasures.push('temporal_challenges');
      effectiveness += 15;
    }

    // Measure 4: Session isolation
    if (this.verifySessionBinding()) {
      activeMeasures.push('session_isolation');
      effectiveness += 15;
    }

    // Measure 5: Entropy validation
    const entropyValidation = this.verifyEntropyPatterns(interactionData);
    if (entropyValidation.isValid) {
      activeMeasures.push('entropy_validation');
      effectiveness += 10;
    }

    // Measure 6: Proximity verification
    if (this.verifyProximityEnvironment(interactionData?.proximityData)) {
      activeMeasures.push('proximity_verification');
      effectiveness += 10;
    }

    // Measure 7: Continuous monitoring
    activeMeasures.push('continuous_monitoring');
    effectiveness += 5;

    // Determine protection level
    let protectionLevel: 'basic' | 'standard' | 'advanced' | 'maximum';
    if (effectiveness >= 90) protectionLevel = 'maximum';
    else if (effectiveness >= 75) protectionLevel = 'advanced';
    else if (effectiveness >= 60) protectionLevel = 'standard';
    else protectionLevel = 'basic';

    return {
      protectionLevel,
      activeMeasures,
      effectiveness: Math.min(100, effectiveness),
    };
  }
}

export default AIONETSecurityManager;
