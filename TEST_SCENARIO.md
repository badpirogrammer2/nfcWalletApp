# NFC Wallet App - Test Scenario: Receipt Generation & NFC Write-Back

## Overview
This test scenario demonstrates the NFC wallet app's ability to:
1. Scan NFC tags
2. Process transactions with amounts
3. Generate receipts
4. Write receipts back to the same NFC tag

## Prerequisites
- Android device with NFC capability
- NFC tags (NTAG213, NTAG215, or similar writable tags)
- NFC tag with some initial data written to it

## Test Environment Setup

### 1. Android Device Configuration
- Enable NFC in device settings
- Enable Developer Options
- Enable USB Debugging
- Install the app via Android Studio or ADB

### 2. NFC Tag Preparation
- Use an NFC tag with existing data (e.g., URL, text, or custom data)
- Ensure the tag is writable (not locked)
- Test tag compatibility with Android NFC

## Test Cases

### Test Case 1: Basic NFC Scanning
**Objective:** Verify basic NFC scanning functionality

**Steps:**
1. Launch the NFC Wallet app
2. Tap "Scan NFC Tag" button
3. Bring NFC tag close to device
4. Verify tag data is detected and displayed

**Expected Results:**
- App detects NFC tag
- Modal appears showing scanned data
- No errors in console

### Test Case 2: Transaction with Amount
**Objective:** Test transaction processing with amount input

**Steps:**
1. Scan an NFC tag (from Test Case 1)
2. In the save modal, enter:
   - Item name: "Coffee Purchase"
   - Amount: "5.50"
3. Tap "Save"

**Expected Results:**
- Item saved to wallet with amount displayed
- Receipt generated automatically
- Success message for NFC write operation
- Item appears in wallet list with green amount display

### Test Case 3: Receipt Generation Verification
**Objective:** Verify receipt content and format

**Steps:**
1. Complete Test Case 2
2. Check the generated receipt by:
   - Viewing item details in wallet
   - Verifying receipt ID format (RCP-timestamp)
   - Confirming receipt contains all required fields

**Expected Receipt Format:**
```
RECEIPT
-------
ID: RCP-1234567890
Item: Coffee Purchase
Amount: $5.50
Date: 9/6/2025, 4:45:49 PM
NFC Data: [original tag data]
-------
Thank you for your transaction!
```

### Test Case 4: NFC Write-Back Verification
**Objective:** Confirm receipt is written back to NFC tag

**Steps:**
1. Complete Test Case 2
2. Use a separate NFC reader app to scan the same tag
3. Verify the tag now contains the receipt data

**Expected Results:**
- Tag contains the generated receipt
- Original data may be overwritten (normal behavior)
- Receipt data is readable by other NFC apps

### Test Case 5: Multiple Transactions
**Objective:** Test handling multiple transactions

**Steps:**
1. Complete Test Case 2 with first tag
2. Repeat with a second NFC tag:
   - Item name: "Book Purchase"
   - Amount: "15.99"
3. Verify both items in wallet
4. Check receipt IDs are unique

**Expected Results:**
- Both transactions saved separately
- Unique receipt IDs for each transaction
- All amounts displayed correctly

### Test Case 6: Edge Cases

#### 6a: Zero Amount Transaction
**Steps:**
1. Scan NFC tag
2. Enter item name but leave amount empty or "0"
3. Save transaction

**Expected Results:**
- Item saved without amount
- No receipt generated
- No NFC write operation attempted

#### 6b: Invalid Amount Format
**Steps:**
1. Scan NFC tag
2. Enter non-numeric amount (e.g., "abc")
3. Attempt to save

**Expected Results:**
- Amount parsed as 0 or handled gracefully
- Transaction processed without receipt

## Screenshots to Capture

### 1. Initial App Screen
- Empty wallet state
- "Scan NFC Tag" button visible

### 2. NFC Scanning in Progress
- "Scanning..." button state
- Modal with scanned data

### 3. Transaction Input Modal
- Item name and amount input fields
- Scanned NFC data display

### 4. Wallet with Transaction
- Item card showing name, amount, and receipt ID
- Green amount highlighting

### 5. Receipt Verification
- External NFC reader showing receipt data on tag

## Error Scenarios to Test

### 1. NFC Write Failure
- Tag is read-only or locked
- Expected: Error alert with appropriate message

### 2. Tag Not Supported
- Incompatible tag type
- Expected: Graceful handling with user notification

### 3. Permission Denied
- NFC permission not granted
- Expected: Permission request or appropriate error

## Performance Expectations

- NFC scanning: < 2 seconds
- Receipt generation: < 1 second
- NFC write operation: < 3 seconds
- App startup: < 5 seconds

## Test Data

### Sample NFC Tag Content
- Text: "Hello World"
- URL: "https://example.com"
- Custom: "PAYMENT:12345"

### Sample Transactions
1. Coffee Purchase - $5.50
2. Book Purchase - $15.99
3. Movie Ticket - $12.00
4. Parking Fee - $8.00

## Success Criteria

- [ ] All test cases pass without errors
- [ ] Receipts generated with correct format
- [ ] NFC write operations successful
- [ ] UI displays amounts and receipt IDs correctly
- [ ] No crashes or unexpected behavior
- [ ] Performance meets expectations

## Tools Required

- Android Studio (for device/emulator setup)
- NFC tag writer app (for verification)
- NFC tag reader app (for verification)
- Camera (for screenshots)

## Notes

- Test on physical Android device (emulator may not support NFC)
- Use writable NFC tags (NTAG series recommended)
- Ensure tags are not password-protected or locked
- Test with different tag types for compatibility
- Document any device-specific behavior

---

# Cross-Platform Test Scenarios: Android Host Card Emulation (HCE) with iOS Client

## Overview
This section covers test scenarios for cross-platform NFC testing where:
- **Android device acts as Host** (using Host Card Emulation to emulate NFC cards)
- **iOS device acts as Client** (reading the emulated cards from Android)
- Tests focus on card presence, data exchange, and transaction processing between platforms

## Prerequisites for Cross-Platform Testing
- Android device with NFC capability and HCE support
- iOS device with NFC capability (iPhone 7 or later)
- Both devices charged and NFC enabled
- Test app installed on both devices
- Physical proximity for NFC communication

## Test Environment Setup

### Android Host Configuration
- Enable NFC and HCE in device settings
- Install test app with HCE functionality
- Configure app to emulate different card types
- Enable Developer Options and USB Debugging

### iOS Client Configuration
- Enable NFC in Settings
- Install companion test app for reading emulated cards
- Ensure NFC permissions are granted
- Test NFC functionality with physical cards first

## Cross-Platform Test Cases

### Test Case HCE-1: Basic Card Emulation Detection
**Objective:** Verify iOS client can detect Android host card emulation

**Setup:**
- Android: Launch app in HCE mode with card emulation enabled
- iOS: Launch companion app in scan mode

**Steps:**
1. Android host starts emulating a basic NFC card
2. iOS client initiates NFC scan
3. Bring devices close together (1-2 cm apart)
4. iOS client attempts to read emulated card data

**Expected Results:**
- iOS detects Android host as NFC card
- Card emulation data is successfully read
- No connection errors or timeouts
- Data transfer completes within 2 seconds

### Test Case HCE-2: Transaction Data Exchange
**Objective:** Test transaction data transfer from Android host to iOS client

**Setup:**
- Android: Configure with sample transaction data for emulation
- iOS: Ready to receive and process transaction data

**Steps:**
1. Android host emulates card with transaction details:
   - Item: "Digital Payment"
   - Amount: "25.00"
   - Transaction ID: "TXN-12345"
2. iOS client scans the emulated card
3. Verify data is correctly received and parsed
4. iOS client processes the transaction

**Expected Results:**
- All transaction data fields transferred correctly
- iOS client displays received data accurately
- Transaction processing completes successfully
- Receipt generation triggered on iOS side

### Test Case HCE-3: Multiple Card Types Emulation
**Objective:** Test different card types emulated by Android host

**Card Types to Test:**
1. **Payment Card Emulation**
   - Emulate credit/debit card data
   - Test secure data transmission
   - Verify encryption/decryption

2. **ID Card Emulation**
   - Emulate identification data
   - Test personal information transfer
   - Verify data integrity

3. **Access Card Emulation**
   - Emulate access control data
   - Test authentication mechanisms
   - Verify permission handling

**Steps:**
1. Android host switches between different card types
2. iOS client scans each emulated card type
3. Verify correct data format for each card type
4. Test error handling for incompatible card types

**Expected Results:**
- All card types emulated successfully
- iOS client recognizes and handles different card formats
- Data integrity maintained across all types
- Proper error handling for unsupported formats

### Test Case HCE-4: Concurrent Multi-Device Testing
**Objective:** Test multiple iOS clients reading Android host simultaneously

**Setup:**
- One Android host device
- Multiple iOS client devices (2-3 devices)
- All devices configured for testing

**Steps:**
1. Android host emulates card with shared data
2. Multiple iOS clients attempt simultaneous scans
3. Test collision detection and handling
4. Verify data consistency across all clients

**Expected Results:**
- No data corruption during concurrent access
- Proper collision detection implemented
- All clients receive consistent data
- Performance remains acceptable with multiple clients

### Test Case HCE-5: Range and Positioning Tests
**Objective:** Test NFC communication range and optimal positioning

**Test Scenarios:**
1. **Optimal Range (1-2 cm)**
   - Test successful communication at recommended distance
   - Verify data transfer reliability

2. **Extended Range (2-4 cm)**
   - Test communication at longer distances
   - Monitor signal strength degradation

3. **Angular Positioning**
   - Test different device orientations
   - Verify communication stability at various angles

4. **Interference Testing**
   - Test with physical barriers (thin materials)
   - Monitor communication reliability

**Steps:**
1. Position devices at varying distances and angles
2. Attempt data transfer at each position
3. Record success rates and transfer times
4. Identify optimal positioning parameters

**Expected Results:**
- Clear optimal range established (1-2 cm)
- Acceptable performance up to 3-4 cm
- Reliable communication at various angles
- Minimal interference from thin barriers

### Test Case HCE-6: Error Handling and Recovery
**Objective:** Test error scenarios and recovery mechanisms

**Error Scenarios:**
1. **Connection Interruption**
   - Device moved apart during transfer
   - Test automatic reconnection
   - Verify data integrity

2. **Host Emulation Failure**
   - Android host stops emulation unexpectedly
   - Test client error handling
   - Verify graceful failure recovery

3. **Client Read Failure**
   - iOS client encounters read error
   - Test retry mechanisms
   - Verify error reporting

4. **Data Corruption**
   - Simulate corrupted data transmission
   - Test checksum validation
   - Verify data recovery procedures

**Steps:**
1. Simulate each error scenario
2. Monitor system response and error handling
3. Test recovery procedures
4. Verify data integrity after errors

**Expected Results:**
- Proper error detection and reporting
- Automatic retry mechanisms working
- Graceful degradation during failures
- Data integrity maintained through errors

### Test Case HCE-7: Performance and Load Testing
**Objective:** Test system performance under various loads

**Performance Metrics:**
- Connection establishment time: < 1 second
- Data transfer rate: > 100 bytes/second
- Concurrent client handling: up to 3 devices
- Battery impact: < 5% per hour of active use

**Load Scenarios:**
1. **High Frequency Transactions**
   - Rapid successive card emulations
   - Test system responsiveness

2. **Large Data Transfers**
   - Transfer large data payloads
   - Monitor transfer times and reliability

3. **Extended Usage**
   - Continuous operation for extended periods
   - Monitor battery drain and thermal performance

**Steps:**
1. Execute performance tests under different loads
2. Monitor system metrics and performance indicators
3. Record any performance degradation
4. Identify performance bottlenecks

**Expected Results:**
- All performance metrics met
- System remains stable under load
- No memory leaks or resource exhaustion
- Acceptable battery life during extended use

## Cross-Platform Test Data

### Sample Emulated Card Data
```json
{
  "cardType": "payment",
  "transactionId": "TXN-12345",
  "amount": "25.00",
  "merchant": "Test Merchant",
  "timestamp": "2025-09-06T17:11:00Z",
  "cardData": {
    "pan": "4111111111111111",
    "expiry": "12/25",
    "cvv": "123"
  }
}
```

### Test Transaction Scenarios
1. **Small Transaction**: $5.00 - Coffee purchase
2. **Medium Transaction**: $25.00 - Restaurant payment
3. **Large Transaction**: $150.00 - Electronics purchase
4. **International Transaction**: €75.00 - Currency conversion test

## Cross-Platform Success Criteria

- [ ] iOS client successfully detects Android HCE
- [ ] Data transfer between platforms works reliably
- [ ] All card types emulated and recognized correctly
- [ ] Concurrent multi-device access handled properly
- [ ] Optimal communication range established
- [ ] Error handling and recovery mechanisms work
- [ ] Performance meets established benchmarks
- [ ] No cross-platform compatibility issues

## Tools Required for Cross-Platform Testing

- Android Studio (for HCE configuration)
- Xcode (for iOS app development/testing)
- NFC debugging tools
- Network analyzers for data transfer monitoring
- Performance monitoring tools
- Battery testing equipment

## Cross-Platform Test Notes

- Test on physical devices only (emulators don't support NFC)
- Ensure both devices have latest OS versions
- Test with different Android/iOS device combinations
- Document any device-specific behaviors
- Monitor battery usage during extended testing
- Test in various environmental conditions (temperature, humidity)
- Consider electromagnetic interference from other devices

## Security Considerations for Cross-Platform Testing

- Test encrypted data transmission
- Verify secure element integration
- Test authentication mechanisms
- Monitor for potential security vulnerabilities
- Ensure compliance with payment industry standards
