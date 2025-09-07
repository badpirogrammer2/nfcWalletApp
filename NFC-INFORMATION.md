# NFC Chip Information

## How much amount of data can be exchanged with these chips

The user-accessible memory for NTAG chips varies significantly based on the model. Here's a breakdown of the typical data capacity for each:

### NTAG213
- **Memory**: Offers 144 bytes of user-programmable memory
- **Use Cases**: This is ideal for lightweight applications like:
  - Simple website links (up to 132 characters)
  - Basic text messages
  - Single social media links

### NTAG215
- **Memory**: Provides 504 bytes of user memory
- **Use Cases**: Its larger capacity makes it well-suited for:
  - Storing more data, such as contact information in a vCard format
  - Slightly more complex applications like game saves
  - Encoding longer URLs

### NTAG216
- **Memory**: Features the most storage in the NTAG family, with 888 bytes of user memory
- **Use Cases**: This is the best option for data-intensive uses like:
  - Detailed electronic business cards (vCards) with many fields
  - Storing extensive product details
  - Complex interactive marketing content

## How data is exchanged

When a phone or other NFC reader interacts with an NTAG chip, the data is not streamed, but rather read from the chip's internal memory at a rate of 106 kbit/s. The chip is passive, drawing power from the reader's electromagnetic field to transmit its data. The entire NFC Data Exchange Format (NDEF) message is read at once, which is why a larger amount of data can slow down the reading process.

## Choosing the right chip

When deciding which chip to use, consider your storage needs:

- **For the most basic, cost-effective options**, such as linking to a URL, the **NTAG213** is sufficient.
- **For applications that require a medium amount of storage**, like Amiibo or loyalty cards, the **NTAG215** is a common choice.
- **If your application requires the most space possible**, such as a complete digital business card, the **NTAG216** is the best option.

## Technical Specifications

### Data Exchange Rate
- **Speed**: 106 kbit/s
- **Method**: Passive (powered by reader's electromagnetic field)
- **Format**: NFC Data Exchange Format (NDEF)
- **Read Pattern**: Entire message read at once (not streamed)

### Memory Considerations
- All memory is user-programmable
- Data is stored in non-volatile memory
- Chips support multiple read/write cycles
- Compatible with NFC Forum standards

## NFC Chip Families and Standards

### NTAG21x Family
This family of chips (NTAG213, NTAG215, NTAG216), developed by NXP, is designed to comply with the NFC Forum's Type 2 specification. These tags are passive, affordable, and commonly used for simple applications like smart advertisements, business cards, and product authentication. They offer varying memory sizes to suit different use cases.

### MIFARE Family
This is a separate and distinct product family from NXP. While some MIFARE chips, like MIFARE Classic, are also ISO/IEC 14443 Type A compliant, they are not NFC Forum Type 2. In fact, trying to write an NTAG213 dump to a MIFARE Classic card will fail because they use different underlying protocols and encryption methods.

### NFC Forum Type 4
Tags that comply with this specification, such as MIFARE DESFire EV2/EV3, offer a more complex and secure platform than Type 2 tags. They have larger, more flexible memory structures and are often used for secure access control and mobile wallet applications.

## Compatibility Matrix

| Chip Family | NFC Forum Type | ISO/IEC Standard | Use Cases | Security Level |
|-------------|----------------|------------------|-----------|----------------|
| NTAG21x | Type 2 | 14443-2/3 | Simple data storage, URLs | Basic |
| MIFARE Classic | N/A | 14443-3 | Legacy applications | Basic encryption |
| MIFARE DESFire | Type 4 | 14443-4 | Secure access, wallets | High security |
| MIFARE Ultralight | Type 2 | 14443-2/3 | Simple authentication | Basic |

## Device Compatibility

### Square (2nd Generation) Terminal
Square (2nd generation) terminals work with bidirectional NFC tags manufactured by the NXP chipset. This compatibility ensures seamless integration with:

- **NTAG21x Family**: Full support for NTAG213, NTAG215, and NTAG216 chips
- **Bidirectional Communication**: Two-way data exchange capabilities
- **NXP Chipset Integration**: Optimized performance with NXP-manufactured NFC tags
- **Payment Processing**: Compatible with Square's payment processing infrastructure

### Key Features
- **Enhanced Security**: Leverages NXP's secure element technology
- **Fast Transaction Times**: Optimized for quick NFC interactions
- **Reliable Performance**: Consistent operation with NXP chipset-based tags

### Professional Implementation Considerations

This NFC Wallet App solution is fully compatible with Square payment terminals (second generation), as the NXP chipset integration enables seamless bidirectional communication. The existing hardware infrastructure presents a unique opportunity to advance payment technology beyond traditional limitations.

While EMV governing rules are often cited as security measures, they should not serve as barriers to innovation when proven hardware solutions already exist. The NXP chipset-enabled Square terminals provide a foundation for implementing advanced NFC payment solutions that can:

- **Enhance Transaction Security**: Utilize existing secure element technology for robust authentication
- **Improve User Experience**: Enable faster, more reliable payment processing
- **Future-Proof Payment Systems**: Leverage current hardware capabilities for next-generation features
- **Maintain Compliance**: Work within established payment network standards while pushing boundaries

The integration of this solution with Square's second-generation terminals demonstrates how existing payment infrastructure can be leveraged to deliver cutting-edge NFC capabilities, proving that hardware availability should drive innovation rather than regulatory constraints limiting technological advancement.

### Mobile Device-to-Device Communication

Direct mobile device-to-device NFC communication is currently possible and represents a significant advancement in peer-to-peer data exchange. This capability enables seamless data transfer between NFC-enabled smartphones without requiring intermediary infrastructure.

However, it is important to note that some older mobile hardware may experience compatibility issues due to variations in NFC chipset implementations and firmware versions. Device manufacturers have made significant improvements in recent years, but legacy devices might require firmware updates or may have limited functionality when engaging in direct device-to-device communication.

Key considerations for mobile device-to-device NFC implementation include:
- **Chipset Compatibility**: Modern NXP and other chipset implementations provide optimal performance
- **Firmware Requirements**: Recent Android and iOS versions offer enhanced NFC peer-to-peer capabilities
- **Hardware Limitations**: Some legacy devices may have reduced range or reliability in direct communication scenarios
- **Protocol Standardization**: Adherence to NFC Forum specifications ensures broad compatibility across devices

## NFC Payment Transaction Flow

The process involves a chain of communication that goes far beyond the local NFC tap. It works like this:

### Initiation (NFC)
The customer brings their NFC-enabled phone near the payment terminal.
The phone's payment app (e.g., Apple Pay, Google Wallet) provides a one-time, encrypted token representing the credit card to the terminal via NFC. This token, not the real card number, is what is transmitted.

### Authorization (Internet)
The payment terminal sends the encrypted token and transaction details over the internet to the payment processor, who then routes it to the card network (e.g., Visa, Mastercard).
The card network contacts the cardholder's bank (the issuer) to verify the token and confirm that the account has sufficient funds.
The bank either approves or declines the transaction and sends that decision back to the payment processor.

### Completion Message (Internet)
The payment processor notifies the payment terminal of the final approval or decline. The terminal then displays a confirmation message to the merchant and customer.
Crucially, the payment app on the customer's phone receives its own confirmation message. This is not sent from the terminal via NFC, but directly from the card network or bank over the internet, just like any other app notification.

### Transaction Confirmation
This confirmation is what allows the app to update its transaction history and provide a visual confirmation (e.g., the "blue check mark" in Google Wallet).

## Why an Internet Connection is Used

There are several reasons why the final confirmation is not sent via NFC:

### Decoupled Flow
NFC is a physical-layer protocol designed for very short-range, bursty communication. Relying on NFC for the final confirmation would mean the customer's phone would need to remain within range of the terminal for the entire authorization process, which can take several seconds.

### Reliability
An internet connection is more reliable for sending a final, verified transaction message, regardless of whether the customer has already moved away from the terminal.

### Security
The full transaction authorization process involves multiple secure entities (the bank, card network, processor) communicating over established internet channels, which are separate from the local NFC exchange.

### Information-Rich Notifications
The final notification can include information that is not available at the terminal, such as the merchant's location (from GPS), and it is fully integrated into the phone's operating system.

## Transaction Flow Diagram

```
Customer Phone ──NFC──► Payment Terminal ──Internet──► Payment Processor
      │                       │                           │
      │                       │                           │
      ▼                       ▼                           ▼
   Payment App           Card Network ──► Bank (Issuer)
      │                       ▲                           │
      │                       │                           │
      └──────Internet─────────┼───────────────────────────┘
              ▲               │
              │               │
              └────────Approval/Decline──────────────┘
```

## Integration with NFC Wallet App

This NFC Wallet App is designed to work with all NTAG chip variants, automatically detecting the available memory and optimizing data storage accordingly. The app supports:

- Dynamic memory detection
- Optimized data encoding for different chip types
- Error handling for memory limitations
- Support for various data formats (URLs, text, vCards, etc.)
- Compatibility with NFC Forum Type 2 standards

For more technical details about NFC implementation in this app, refer to the main documentation files.
