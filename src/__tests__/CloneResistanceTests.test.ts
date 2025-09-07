import { BlockchainMessageManager, AIONETSecurityManager } from '../aionetSecurity';

// Clone-Resistant Security Test Suite
// Comprehensive testing of clone detection and prevention mechanisms

describe('Clone-Resistant Security Test Suite', () => {
  let securityManager: AIONETSecurityManager;
  let blockchainManager: BlockchainMessageManager;

  beforeEach(() => {
    securityManager = AIONETSecurityManager.getInstance();
    blockchainManager = BlockchainMessageManager.getInstance('test-device');
  });

  describe('Hardware Fingerprinting Tests', () => {
    test('Unique Device Identification', async () => {
      const deviceId1 = 'DEVICE-001';
      const deviceId2 = 'DEVICE-002';

      const fingerprint1 = blockchainManager['generateUniquenessFingerprint'](deviceId1);
      const fingerprint2 = blockchainManager['generateUniquenessFingerprint'](deviceId2);

      // Fingerprints should be unique for different devices
      expect(fingerprint1).not.toBe(fingerprint2);
      expect(fingerprint1.length).toBe(64); // SHA-256 hash length
      expect(fingerprint2.length).toBe(64);
    });

    test('Hardware Fingerprint Consistency', async () => {
      const deviceId = 'DEVICE-TEST';
      const interactionData = {
        touchPoints: [
          { x: 100, y: 200, pressure: 0.8, timestamp: Date.now() },
          { x: 150, y: 250, pressure: 0.6, timestamp: Date.now() + 100 },
        ],
        swipePatterns: [
          { startX: 50, startY: 100, endX: 200, endY: 150, duration: 300, velocity: 500 },
        ],
      };

      const fingerprint1 = blockchainManager['generateUniquenessFingerprint'](deviceId, interactionData);
      const fingerprint2 = blockchainManager['generateUniquenessFingerprint'](deviceId, interactionData);

      // Same input should produce different fingerprints due to entropy
      expect(fingerprint1).not.toBe(fingerprint2);
      expect(fingerprint1.length).toBe(64);
      expect(fingerprint2.length).toBe(64);
    });

    test('Hardware Fingerprint with Missing Data', async () => {
      const deviceId = 'DEVICE-INCOMPLETE';

      // Test with no interaction data
      const fingerprint1 = blockchainManager['generateUniquenessFingerprint'](deviceId);

      // Test with partial interaction data
      const partialData = {
        touchPoints: [{ x: 100, y: 200, pressure: 0.5, timestamp: Date.now() }],
      };
      const fingerprint2 = blockchainManager['generateUniquenessFingerprint'](deviceId, partialData);

      expect(fingerprint1).not.toBe(fingerprint2);
      expect(fingerprint1.length).toBe(64);
      expect(fingerprint2.length).toBe(64);
    });
  });

  describe('Behavioral Pattern Analysis Tests', () => {
    test('Normal Human Interaction Patterns', async () => {
      const normalInteractionData = {
        touchPoints: [
          { x: 120, y: 180, pressure: 0.7, timestamp: Date.now() },
          { x: 125, y: 185, pressure: 0.8, timestamp: Date.now() + 50 },
          { x: 130, y: 190, pressure: 0.6, timestamp: Date.now() + 100 },
          { x: 135, y: 195, pressure: 0.75, timestamp: Date.now() + 150 },
          { x: 140, y: 200, pressure: 0.65, timestamp: Date.now() + 200 },
        ],
        swipePatterns: [
          { startX: 100, startY: 150, endX: 250, endY: 200, duration: 400, velocity: 375 },
          { startX: 80, startY: 120, endX: 220, endY: 180, duration: 350, velocity: 400 },
        ],
        timingData: {
          responseTime: 250,
          interactionDelay: 50,
          sessionDuration: 5000,
          patternConsistency: 0.85,
        },
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', normalInteractionData);

      expect(result.isCloned).toBe(false);
      expect(result.confidence).toBeLessThan(50);
      expect(result.riskLevel).toBe('low');
    });

    test('Suspicious Automated Interaction Patterns', async () => {
      const automatedInteractionData = {
        touchPoints: [
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() }, // Perfect pressure
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() }, // Identical
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() }, // Identical
        ],
        swipePatterns: [
          { startX: 50, startY: 100, endX: 200, endY: 150, duration: 100, velocity: 1500 }, // Too fast
        ],
        timingData: {
          responseTime: 10, // Too fast for human
          interactionDelay: 0,
          sessionDuration: 100,
          patternConsistency: 1.0, // Too perfect
        },
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', automatedInteractionData);

      expect(result.isCloned).toBe(true);
      expect(result.confidence).toBeGreaterThan(60);
      expect(result.riskLevel).toBe('high');
      expect(result.detectionMethods).toContain('behavioral_pattern_anomaly');
    });

    test('Edge Case: Minimal Interaction Data', async () => {
      const minimalInteractionData = {
        touchPoints: [
          { x: 100, y: 150, pressure: 0.5, timestamp: Date.now() },
        ],
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', minimalInteractionData);

      // Should still provide a result even with minimal data
      expect(result).toHaveProperty('isCloned');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('detectionMethods');
      expect(result).toHaveProperty('riskLevel');
    });

    test('Edge Case: No Interaction Data', async () => {
      const result = await blockchainManager.detectCloningAttempt('test-device');

      // Should handle missing interaction data gracefully
      expect(result.isCloned).toBe(true); // High suspicion without data
      expect(result.confidence).toBeGreaterThan(20);
      expect(result.detectionMethods).toContain('behavioral_pattern_anomaly');
    });
  });

  describe('Temporal Consistency Tests', () => {
    test('Normal Time Progression', async () => {
      // Simulate normal time progression
      const result = await blockchainManager.detectCloningAttempt('test-device');

      // Should not flag normal time progression
      expect(result.detectionMethods).not.toContain('temporal_inconsistency');
    });

    test('Suspicious Time Jumps', async () => {
      // Simulate time manipulation by mocking Date.now
      const originalDateNow = Date.now;
      const mockTimes = [
        Date.now() - 3600000, // 1 hour ago
        Date.now() + 3600000, // 1 hour ahead
        Date.now() - 86400000, // 1 day ago
      ];

      for (const mockTime of mockTimes) {
        Date.now = jest.fn(() => mockTime);

        const result = await blockchainManager.detectCloningAttempt('test-device');

        // Should detect temporal inconsistencies
        expect(result.detectionMethods).toContain('temporal_inconsistency');
        expect(result.confidence).toBeGreaterThan(15);
      }

      // Restore original Date.now
      Date.now = originalDateNow;
    });

    test('Rapid Successive Operations', async () => {
      // Simulate very rapid operations that might indicate automation
      const rapidOperations = [];

      for (let i = 0; i < 10; i++) {
        rapidOperations.push(
          blockchainManager.detectCloningAttempt('test-device', {
            timingData: {
              responseTime: 5, // Very fast response
              interactionDelay: 1,
              sessionDuration: 50,
              patternConsistency: 0.95,
            },
          })
        );
      }

      const results = await Promise.all(rapidOperations);

      // Should detect suspicious timing patterns
      results.forEach(result => {
        expect(result.detectionMethods).toContain('behavioral_pattern_anomaly');
      });
    });
  });

  describe('Session Binding Tests', () => {
    test('Valid Session Binding', async () => {
      const result = await blockchainManager.detectCloningAttempt('test-device');

      // Should not flag valid session binding
      expect(result.detectionMethods).not.toContain('session_binding_failure');
    });

    test('Session Hijacking Simulation', async () => {
      // Simulate session hijacking by manipulating session data
      const originalGetCurrentSession = blockchainManager['getCurrentSession'];
      blockchainManager['getCurrentSession'] = jest.fn(() => ({
        startTime: Date.now() - 7200000, // 2 hours ago (expired)
      }));

      const result = await blockchainManager.detectCloningAttempt('test-device');

      // Should detect session binding failure
      expect(result.detectionMethods).toContain('session_binding_failure');
      expect(result.confidence).toBeGreaterThan(10);

      // Restore original method
      blockchainManager['getCurrentSession'] = originalGetCurrentSession;
    });

    test('Concurrent Session Detection', async () => {
      // Simulate multiple concurrent sessions
      const concurrentResults = await Promise.all([
        blockchainManager.detectCloningAttempt('test-device'),
        blockchainManager.detectCloningAttempt('test-device'),
        blockchainManager.detectCloningAttempt('test-device'),
      ]);

      // Should handle concurrent sessions appropriately
      concurrentResults.forEach(result => {
        expect(result).toHaveProperty('isCloned');
        expect(result).toHaveProperty('confidence');
      });
    });
  });

  describe('Entropy Pattern Analysis Tests', () => {
    test('High Entropy Human Patterns', async () => {
      const highEntropyData = {
        touchPoints: [
          { x: 123.45, y: 178.92, pressure: 0.734, timestamp: Date.now() },
          { x: 156.78, y: 201.34, pressure: 0.689, timestamp: Date.now() + 87 },
          { x: 189.12, y: 234.56, pressure: 0.756, timestamp: Date.now() + 156 },
          { x: 145.67, y: 198.43, pressure: 0.712, timestamp: Date.now() + 234 },
        ],
        swipePatterns: [
          { startX: 98.76, startY: 143.21, endX: 245.67, endY: 187.89, duration: 387, velocity: 382.45 },
          { startX: 76.54, startY: 112.98, endX: 223.45, endY: 167.32, duration: 423, velocity: 349.67 },
        ],
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', highEntropyData);

      // Should recognize natural human entropy patterns
      expect(result.detectionMethods).not.toContain('entropy_pattern_anomaly');
      expect(result.confidence).toBeLessThan(40);
    });

    test('Low Entropy Automated Patterns', async () => {
      const lowEntropyData = {
        touchPoints: [
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
        ],
        swipePatterns: [
          { startX: 50, startY: 100, endX: 200, endY: 150, duration: 100, velocity: 1500 },
          { startX: 50, startY: 100, endX: 200, endY: 150, duration: 100, velocity: 1500 },
        ],
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', lowEntropyData);

      // Should detect low entropy (predictable) patterns
      expect(result.detectionMethods).toContain('entropy_pattern_anomaly');
      expect(result.confidence).toBeGreaterThan(20);
    });

    test('Abnormal Entropy Patterns', async () => {
      const abnormalEntropyData = {
        touchPoints: [
          { x: Math.random() * 1000, y: Math.random() * 1000, pressure: Math.random(), timestamp: Date.now() + Math.random() * 1000 },
          { x: Math.random() * 1000, y: Math.random() * 1000, pressure: Math.random(), timestamp: Date.now() + Math.random() * 1000 },
          { x: Math.random() * 1000, y: Math.random() * 1000, pressure: Math.random(), timestamp: Date.now() + Math.random() * 1000 },
        ],
        swipePatterns: [
          { startX: Math.random() * 500, startY: Math.random() * 500, endX: Math.random() * 500, endY: Math.random() * 500, duration: Math.random() * 1000, velocity: Math.random() * 2000 },
        ],
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', abnormalEntropyData);

      // Should detect abnormal entropy patterns
      expect(result.detectionMethods).toContain('entropy_pattern_anomaly');
      expect(result.confidence).toBeGreaterThan(15);
    });
  });

  describe('Proximity and Environmental Verification Tests', () => {
    test('Valid Proximity Environment', async () => {
      const validProximityData = {
        signalStrength: 0.85,
        distance: 5.5,
        angle: 15,
        interference: 0.1,
      };

      const interactionData = {
        proximityData: validProximityData,
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', interactionData);

      // Should not flag valid proximity data
      expect(result.detectionMethods).not.toContain('proximity_environment_mismatch');
    });

    test('Invalid Proximity Environment', async () => {
      const invalidProximityData = {
        signalStrength: 1.5, // Invalid: > 1.0
        distance: -10, // Invalid: negative
        angle: 200, // Potentially suspicious
        interference: 1.2, // Invalid: > 1.0
      };

      const interactionData = {
        proximityData: invalidProximityData,
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', interactionData);

      // Should detect proximity/environment anomalies
      expect(result.detectionMethods).toContain('proximity_environment_mismatch');
      expect(result.confidence).toBeGreaterThan(5);
    });

    test('Missing Proximity Data', async () => {
      const result = await blockchainManager.detectCloningAttempt('test-device', {});

      // Should handle missing proximity data gracefully
      expect(result).toHaveProperty('isCloned');
      expect(result).toHaveProperty('confidence');
    });
  });

  describe('Clone Resistance Score Calculation Tests', () => {
    test('High Clone Resistance Score', async () => {
      const highQualityInteractionData = {
        touchPoints: [
          { x: 120, y: 180, pressure: 0.7, timestamp: Date.now() },
          { x: 125, y: 185, pressure: 0.8, timestamp: Date.now() + 50 },
          { x: 130, y: 190, pressure: 0.6, timestamp: Date.now() + 100 },
          { x: 135, y: 195, pressure: 0.75, timestamp: Date.now() + 150 },
          { x: 140, y: 200, pressure: 0.65, timestamp: Date.now() + 200 },
        ],
        swipePatterns: [
          { startX: 100, startY: 150, endX: 250, endY: 200, duration: 400, velocity: 375 },
          { startX: 80, startY: 120, endX: 220, endY: 180, duration: 350, velocity: 400 },
        ],
        timingData: {
          responseTime: 250,
          interactionDelay: 50,
          sessionDuration: 5000,
          patternConsistency: 0.85,
        },
        proximityData: {
          signalStrength: 0.8,
          distance: 8,
          angle: 10,
          interference: 0.05,
        },
      };

      const trustScore = await blockchainManager['calculateTrustScore']('test-device', highQualityInteractionData);

      expect(trustScore.cloneResistanceScore).toBeGreaterThan(70);
      expect(trustScore.uniquenessFingerprint).toBeDefined();
      expect(trustScore.uniquenessFingerprint.length).toBe(64);
    });

    test('Low Clone Resistance Score', async () => {
      const lowQualityInteractionData = {
        touchPoints: [
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
        ],
        timingData: {
          responseTime: 10,
          interactionDelay: 0,
          sessionDuration: 100,
          patternConsistency: 1.0,
        },
      };

      const trustScore = await blockchainManager['calculateTrustScore']('test-device', lowQualityInteractionData);

      expect(trustScore.cloneResistanceScore).toBeLessThan(50);
      expect(trustScore.uniquenessFingerprint).toBeDefined();
    });

    test('Clone Resistance Score Boundaries', async () => {
      // Test with no interaction data
      const emptyTrustScore = await blockchainManager['calculateTrustScore']('test-device');
      expect(emptyTrustScore.cloneResistanceScore).toBeGreaterThanOrEqual(0);
      expect(emptyTrustScore.cloneResistanceScore).toBeLessThanOrEqual(100);

      // Test with minimal interaction data
      const minimalData = {
        touchPoints: [{ x: 100, y: 150, pressure: 0.5, timestamp: Date.now() }],
      };
      const minimalTrustScore = await blockchainManager['calculateTrustScore']('test-device', minimalData);
      expect(minimalTrustScore.cloneResistanceScore).toBeGreaterThanOrEqual(0);
      expect(minimalTrustScore.cloneResistanceScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Anti-Cloning Measures Implementation Tests', () => {
    test('Maximum Protection Level', async () => {
      const comprehensiveInteractionData = {
        touchPoints: [
          { x: 120, y: 180, pressure: 0.7, timestamp: Date.now() },
          { x: 125, y: 185, pressure: 0.8, timestamp: Date.now() + 50 },
          { x: 130, y: 190, pressure: 0.6, timestamp: Date.now() + 100 },
          { x: 135, y: 195, pressure: 0.75, timestamp: Date.now() + 150 },
          { x: 140, y: 200, pressure: 0.65, timestamp: Date.now() + 200 },
        ],
        swipePatterns: [
          { startX: 100, startY: 150, endX: 250, endY: 200, duration: 400, velocity: 375 },
          { startX: 80, startY: 120, endX: 220, endY: 180, duration: 350, velocity: 400 },
        ],
        timingData: {
          responseTime: 250,
          interactionDelay: 50,
          sessionDuration: 5000,
          patternConsistency: 0.85,
        },
        proximityData: {
          signalStrength: 0.8,
          distance: 8,
          angle: 10,
          interference: 0.05,
        },
      };

      const protectionResult = await blockchainManager['implementAntiCloningMeasures']('test-device', comprehensiveInteractionData);

      expect(protectionResult.protectionLevel).toBe('maximum');
      expect(protectionResult.effectiveness).toBeGreaterThan(90);
      expect(protectionResult.activeMeasures).toContain('hardware_binding');
      expect(protectionResult.activeMeasures).toContain('behavioral_biometrics');
      expect(protectionResult.activeMeasures).toContain('temporal_challenges');
      expect(protectionResult.activeMeasures).toContain('session_isolation');
      expect(protectionResult.activeMeasures).toContain('entropy_validation');
      expect(protectionResult.activeMeasures).toContain('proximity_verification');
      expect(protectionResult.activeMeasures).toContain('continuous_monitoring');
    });

    test('Basic Protection Level', async () => {
      const minimalInteractionData = {
        touchPoints: [
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
        ],
      };

      const protectionResult = await blockchainManager['implementAntiCloningMeasures']('test-device', minimalInteractionData);

      expect(protectionResult.protectionLevel).toBe('basic');
      expect(protectionResult.effectiveness).toBeLessThan(60);
      expect(protectionResult.activeMeasures).toContain('continuous_monitoring');
    });

    test('Advanced Protection Level', async () => {
      const goodInteractionData = {
        touchPoints: [
          { x: 120, y: 180, pressure: 0.7, timestamp: Date.now() },
          { x: 125, y: 185, pressure: 0.8, timestamp: Date.now() + 50 },
          { x: 130, y: 190, pressure: 0.6, timestamp: Date.now() + 100 },
        ],
        swipePatterns: [
          { startX: 100, startY: 150, endX: 250, endY: 200, duration: 400, velocity: 375 },
        ],
        timingData: {
          responseTime: 250,
          interactionDelay: 50,
          sessionDuration: 3000,
          patternConsistency: 0.8,
        },
      };

      const protectionResult = await blockchainManager['implementAntiCloningMeasures']('test-device', goodInteractionData);

      expect(protectionResult.protectionLevel).toBe('advanced');
      expect(protectionResult.effectiveness).toBeGreaterThanOrEqual(75);
      expect(protectionResult.effectiveness).toBeLessThan(90);
    });
  });

  describe('Comprehensive Clone Detection Scenarios', () => {
    test('Multi-Factor Clone Detection', async () => {
      // Simulate a comprehensive clone attempt with multiple suspicious indicators
      const suspiciousInteractionData = {
        touchPoints: [
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() }, // Identical points
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
          { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
        ],
        swipePatterns: [
          { startX: 50, startY: 100, endX: 200, endY: 150, duration: 50, velocity: 3000 }, // Too fast
        ],
        timingData: {
          responseTime: 5, // Too fast
          interactionDelay: 0,
          sessionDuration: 50, // Too short
          patternConsistency: 1.0, // Too perfect
        },
        proximityData: {
          signalStrength: 1.2, // Invalid
          distance: -5, // Invalid
          angle: 180,
          interference: 1.5, // Invalid
        },
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', suspiciousInteractionData);

      expect(result.isCloned).toBe(true);
      expect(result.confidence).toBeGreaterThan(70);
      expect(result.riskLevel).toBe('critical');
      expect(result.detectionMethods.length).toBeGreaterThan(3);
    });

    test('False Positive Prevention', async () => {
      // Test with legitimate but unusual interaction patterns
      const unusualButLegitimateData = {
        touchPoints: [
          { x: 50, y: 50, pressure: 0.3, timestamp: Date.now() }, // Light touch
          { x: 51, y: 51, pressure: 0.31, timestamp: Date.now() + 200 }, // Slow movement
        ],
        swipePatterns: [
          { startX: 100, startY: 200, endX: 150, endY: 250, duration: 800, velocity: 62.5 }, // Slow swipe
        ],
        timingData: {
          responseTime: 800, // Slow response
          interactionDelay: 200,
          sessionDuration: 10000, // Long session
          patternConsistency: 0.6, // Moderate consistency
        },
        proximityData: {
          signalStrength: 0.9,
          distance: 2, // Very close
          angle: 5,
          interference: 0.02, // Very low interference
        },
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', unusualButLegitimateData);

      // Should not flag as cloned despite unusual patterns
      expect(result.isCloned).toBe(false);
      expect(result.confidence).toBeLessThan(50);
      expect(result.riskLevel).not.toBe('critical');
    });

    test('Gradual Clone Detection', async () => {
      // Test detection of gradually changing clone behavior
      const gradualTests = [
        // Initial normal behavior
        {
          touchPoints: [
            { x: 120, y: 180, pressure: 0.7, timestamp: Date.now() },
            { x: 125, y: 185, pressure: 0.8, timestamp: Date.now() + 50 },
          ],
          timingData: { responseTime: 250, interactionDelay: 50, sessionDuration: 2000, patternConsistency: 0.8 },
        },
        // Slightly suspicious
        {
          touchPoints: [
            { x: 120, y: 180, pressure: 0.9, timestamp: Date.now() },
            { x: 120, y: 180, pressure: 0.9, timestamp: Date.now() + 20 },
          ],
          timingData: { responseTime: 100, interactionDelay: 20, sessionDuration: 1000, patternConsistency: 0.9 },
        },
        // Clearly suspicious
        {
          touchPoints: [
            { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
            { x: 100, y: 150, pressure: 1.0, timestamp: Date.now() },
          ],
          timingData: { responseTime: 10, interactionDelay: 0, sessionDuration: 100, patternConsistency: 1.0 },
        },
      ];

      const results = await Promise.all(
        gradualTests.map(data => blockchainManager.detectCloningAttempt('test-device', data))
      );

      // Should show increasing suspicion levels
      expect(results[0].confidence).toBeLessThan(results[1].confidence);
      expect(results[1].confidence).toBeLessThan(results[2].confidence);
      expect(results[2].isCloned).toBe(true);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('Empty Device ID', async () => {
      const result = await blockchainManager.detectCloningAttempt('', {
        touchPoints: [{ x: 100, y: 150, pressure: 0.5, timestamp: Date.now() }],
      });

      // Should handle empty device ID gracefully
      expect(result).toHaveProperty('isCloned');
      expect(result).toHaveProperty('confidence');
    });

    test('Extremely Large Interaction Data', async () => {
      const largeTouchPoints = [];
      for (let i = 0; i < 1000; i++) {
        largeTouchPoints.push({
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          pressure: Math.random(),
          timestamp: Date.now() + i * 10,
        });
      }

      const largeInteractionData = {
        touchPoints: largeTouchPoints,
        swipePatterns: [],
        timingData: {
          responseTime: 500,
          interactionDelay: 50,
          sessionDuration: 60000,
          patternConsistency: 0.7,
        },
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', largeInteractionData);

      // Should handle large datasets without performance issues
      expect(result).toHaveProperty('isCloned');
      expect(result).toHaveProperty('confidence');
    });

    test('Invalid Data Types', async () => {
      const invalidInteractionData = {
        touchPoints: [
          { x: NaN, y: Infinity, pressure: -1, timestamp: NaN },
          { x: 100, y: 150, pressure: 0.5, timestamp: Date.now() }, // Valid fallback
        ] as any, // Cast to bypass type checking for invalid data test
        swipePatterns: [
          { startX: 50, startY: 100, endX: 200, endY: 150, duration: 300, velocity: 500 }, // Valid fallback
        ] as any,
        timingData: {
          responseTime: 500, // Valid fallback
          interactionDelay: 50,
          sessionDuration: 2000,
          patternConsistency: 0.8,
        },
      };

      const result = await blockchainManager.detectCloningAttempt('test-device', invalidInteractionData);

      // Should handle data gracefully without crashing
      expect(result).toHaveProperty('isCloned');
      expect(result).toHaveProperty('confidence');
      expect(result.detectionMethods).toContain('behavioral_pattern_anomaly');
    });

    test('Race Conditions in Clone Detection', async () => {
      // Test concurrent clone detection attempts
      const concurrentPromises = [];

      for (let i = 0; i < 20; i++) {
        concurrentPromises.push(
          blockchainManager.detectCloningAttempt(`device-${i}`, {
            touchPoints: [{ x: 100 + i, y: 150 + i, pressure: 0.5, timestamp: Date.now() }],
            timingData: { responseTime: 200 + i, interactionDelay: 20, sessionDuration: 1000, patternConsistency: 0.8 },
          })
        );
      }

      const results = await Promise.all(concurrentPromises);

      // Should handle concurrent operations without interference
      expect(results).toHaveLength(20);
      results.forEach(result => {
        expect(result).toHaveProperty('isCloned');
        expect(result).toHaveProperty('confidence');
      });
    });
  });
});
