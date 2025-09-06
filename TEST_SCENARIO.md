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
