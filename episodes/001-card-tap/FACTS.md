# FACTS — Episode 001: What Happens After You Tap Your Card?

Every claim spoken or printed in the film, with its source. Machine-readable copy: `FACTS.json`.

**Verification status.** This session's network policy blocked direct page fetches (sec.gov, visa.com, visa.de,
community.developer.visa.com). Every source below was found and quoted through web search result extracts, not by
opening the page. Status `search-quoted` means the wording comes from that extract. Before publishing, a person must open
each URL and change the status to `verified` (or fix the claim).

Date checked: 2026-10-29.

| # | On-screen / spoken claim | Value | Source | Quoted wording (from search extract) | Status |
|---|---|---|---|---|---|
| F1 | A contactless card works within a few centimetres of the reader | under 4 cm | https://www.spark.money/glossary/contactless-payment | "NFC contactless payments operate at 13.56 MHz over a range of under 4 cm" | search-quoted (vendor glossary; want an EMVCo/network source) |
| F2 | The card has no battery; the reader's radio field powers the chip | — | https://idtechproducts.com/technical-post/easy-contactless-transactions | "The reader broadcasts a low-power radio field that powers passive cards without a battery." | search-quoted (vendor) |
| F3 | The chip makes a one-time code for this purchase; it can't be reused, so copied data is useless | one per transaction | https://www.emvco.com/emv-technologies/emv-contact-chip/ ; https://usa.visa.com/dam/VCOM/Media%20Kits/PDF/EMV_Chip_Media_Fact_Sheet_FAQ.pdf | EMVCo: "a one-time security code (cryptogram) for each transaction … unique to each transaction and cannot be reused." Visa: a stolen cryptogram has already been used and can't make a working counterfeit | search-quoted (primary bodies) |
| F4 | Route: terminal → acquirer (the shop's bank) → card network → issuer (your bank), and the answer returns the same way | — | https://community.developer.visa.com/t5/Tutorials/A-Detailed-Look-at-the-Payments-Ecosystem-from-Visa-Payment/ba-p/7463 ; https://www.marqeta.com/demystifying-cards-guide/card-payments-ecosystem | "the acquirer calls Visa and sends data over via an ISO 8583 message; Visa receives it and notes the card number; Visa then routes a message to the issuer processor" … decision returns through the network to the acquirer and terminal | search-quoted |
| F5 | The network finds your bank from the card number | — | same as F4 | "Visa receives it and notes the card number … routes a message to the issuer processor" | search-quoted |
| F6 | The issuer checks: is the card genuine (the code), is the account open, is there money or credit, does it look like fraud | 4 checks (our grouping) | https://stripe.com/resources/more/card-authorization-explained ; https://developer.visa.com/request_response_codes ; https://www.emvco.com/emv-technologies/emv-contact-chip/ | Stripe: the issuer reviews "card validity and sufficient funds"; Visa response codes: 51 not sufficient funds, 46 closed account, 41 lost card, 43 stolen card, 59 suspected fraud; EMVCo: the cryptogram lets "the card issuer … authenticate the card" | search-quoted. "Four questions" is our editorial grouping of these checks, not a published list |
| F12 | "Café paid · $4.75, less fees": the merchant receives the amount minus fees | — | https://paymentexpert.com/2026/03/19/four-party-card-model-explained/ ; https://www.spark.money/glossary/four-party-model | at settlement, merchants receive less than the full transaction value because deductions for each party (interchange, scheme fees) are applied first | search-quoted |
| F13 | "Clearing · the day's purchases, batched" | — | https://www.spark.money/glossary/four-party-model | clearing exchanges transaction details between acquirer and issuer and happens in batches; netting reduces the number of money transfers | search-quoted |
| F8 | Approval comes back within seconds | "within seconds" | https://www.visa.com/en-ua/newsroom/visa-intelligent-authorization | acquirers send real-time authorization requests through card networks to issuers, "which approve or decline within seconds" | search-quoted (Visa press release, March 2026) |
| F9 | One major network's published capacity: 65,000+ transaction messages per second | 65,000+ | https://www.visa.gr/dam/VCOM/download/corporate/media/visanet-technology/aboutvisafactsheet.pdf ; Visa FY2017/FY2018 10-K | "65,000+ transaction messages per second (capacity)"; 10-K: "capable of handling more than 65,000 transaction messages a second" | search-quoted (figure dated Aug 2017; repeated 2019). Printed with "Visa, published capacity" |
| F10 | Approval moves no money: authorization only checks and holds | — | https://pcibooking.net/?p=7562 ; https://www.marqeta.com/demystifying-cards-guide/card-payments-ecosystem | "Payment authorization does not actually transfer funds—it ensures that the customer has enough money to make the purchase." | search-quoted |
| F11 | The money moves later, in clearing and settlement, usually 1–3 business days | 1–3 business days | https://pcibooking.net/?p=7562 ; https://www.spark.money/glossary/four-party-model | "it can take anywhere from one to three business days"; four-party model: "one to two business days in the U.S." | search-quoted. Sources disagree (1–2 vs 1–3), so the film prints the wider range "1–3 business days" |

## Not facts (story values)

- The purchase: a coffee for **$4.75** at a fictional café. Invented for the story; the film never claims it is real.
- The map is a **metaphor**: lines, stations and regions stand for steps and parties. The film says so on the sheet
  ("A map of one card payment · not to scale · simplified").
- No real network, bank or brand is named or shown in the picture except as a source credit on the capacity callout (F9).

## Checked and not used

- Decline codes 51 (insufficient funds), 59 (suspected fraud), 05 (do not honor) — https://developer.visa.com/request_response_codes , https://www.adyen.com/knowledge-hub/do-not-honor . Planned as a "declines" line; cut because it could not be held long enough to read. Kept for a future Short ("Why your card gets declined").

- "1.3 seconds" end-to-end: no source found for a specific figure. Not used.
- "Under 500 ms" tap time: only vendor and patent sources, no EMVCo rule. Not used.
- 2010 DOJ declaration "VisaNet average < 1 second": dated, and its definition excludes the issuer's time. Not used.
- Visa "96.3 % approval rate": company-reported, 2026, not needed. Not used.
