# API Integration Safety Checklist (Facebook, Google, TikTok, etc.)

> Χρησιμοποίησε αυτή τη λίστα κάθε φορά που υλοποιείς ή ελέγχεις integration με διαφημιστικές πλατφόρμες για να ΜΗΝ φας ban!

---

## 1. Χρησιμοποίησε ΠΑΝΤΑ το επίσημο OAuth flow
- [ ] Ποτέ μην ζητάς username/password ή κάνεις screen scraping
- [ ] Πάντα redirect στο επίσημο OAuth URL της πλατφόρμας
- [ ] Πάρε τα tokens με τον σωστό τρόπο (OAuth2)

## 2. Χρησιμοποίησε το δικό σου verified app
- [ ] Κάθε integration γίνεται μέσω δικού σου Facebook App, Google Project, TikTok App
- [ ] Το app είναι verified (privacy policy, terms, κ.λπ.)
- [ ] Δεν χρησιμοποιείς test/shared apps σε production

## 3. Ζήτα ΜΟΝΟ τα permissions που χρειάζεσαι
- [ ] Ζήτα μόνο τα απολύτως απαραίτητα permissions (π.χ. για Facebook Ads, όχι για προσωπικά δεδομένα)
- [ ] Ενημέρωσε τον χρήστη ποια permissions ζητάς και γιατί

## 4. Σέβομαι τα rate limits & usage policies
- [ ] Δεν κάνω μαζικά/συνεχή requests
- [ ] Δεν προσπαθώ να παρακάμψω τα rate limits
- [ ] Δεν κάνω automation που παραβιάζει τους όρους χρήσης

## 5. Σωστή διαχείριση tokens
- [ ] Αποθηκεύω tokens με ασφάλεια (όχι plain text)
- [ ] Κάνω refresh tokens με τον σωστό τρόπο
- [ ] Δεν χρησιμοποιώ ληγμένα tokens

## 6. User transparency & control
- [ ] Ο χρήστης μπορεί να αποσυνδέσει το integration όποτε θέλει
- [ ] Ο χρήστης βλέπει τι permissions έχει δώσει
- [ ] Ο χρήστης μπορεί να διαγράψει τα tokens του

## 7. Monitoring & support
- [ ] Ενημερώνω τους πελάτες να ΜΗΝ παραβιάζουν τους όρους των πλατφορμών
- [ ] Αν υπάρξει warning/ban, ενημερώνω άμεσα τον πελάτη

---

**Αν ακολουθείς αυτή τη λίστα, ελαχιστοποιείς τον κίνδυνο για ban και έχεις επαγγελματικό, ασφαλές SaaS!**

_Αποθηκευμένο για μελλοντική αναφορά._ 