# Facebook API Safety Guide - Επαγγελματικοί Λογαριασμοί

## ⚠️ **ΠΡΟΣΟΧΗ: Επαγγελματικοί Διαφημιστικοί Λογαριασμοί**

Αυτός ο οδηγός είναι **ΚΡΙΤΙΚΑ ΣΗΜΑΝΤΙΚΟΣ** για επαγγελματικούς διαφημιστικούς λογαριασμούς. Η παραβίαση των Facebook policies μπορεί να οδηγήσει σε **μόνιμο ban** των λογαριασμών σας.

---

## 🛡️ **Ασφάλεια & Προστασία**

### **Τι έχουμε υλοποιήσει για την ασφάλεια:**

1. **Rate Limiting**: Μέγιστο 10 κλήσεις ανά λεπτό ανά χρήστη
2. **Safe API Wrapper**: Όλες οι κλήσεις περνάνε από ασφαλές wrapper
3. **Error Handling**: Προσεκτική διαχείριση Facebook errors
4. **User-Agent**: Προσδιορισμός της εφαρμογής μας
5. **Timeout Protection**: Προστασία από hanging requests

### **Προσθήκες Ασφάλειας:**

```typescript
// Rate limiting: 10 requests/minute per user
const MAX_REQUESTS_PER_MINUTE = 10;

// Safe API wrapper με error handling
const safeFacebookAPICall = async (url: string, userId: string) => {
  // Rate limit check
  // Proper headers
  // Error handling για όλους τους Facebook error codes
  // Timeout protection
};
```

---

## 📋 **Best Practices για Επαγγελματικούς Λογαριασμούς**

### **1. Rate Limiting**
- ✅ **Μέγιστο 10 κλήσεις/λεπτό** ανά χρήστη
- ✅ **Αυτόματη αναμονή** αν υπερβείτε το όριο
- ✅ **User-specific tracking** για rate limiting

### **2. API Call Safety**
- ✅ **Όλες οι κλήσεις** περνάνε από ασφαλές wrapper
- ✅ **Proper headers** (User-Agent, Accept)
- ✅ **Error code handling** για όλους τους Facebook errors
- ✅ **Timeout protection** (10 δευτερόλεπτα)

### **3. Token Management**
- ✅ **Ασφαλής αποθήκευση** στη βάση
- ✅ **Αυτόματος έλεγχος λήξης**
- ✅ **Multi-user support** (κάθε χρήστης το δικό του token)

### **4. Error Handling**
- ✅ **Facebook Error Code 4**: Rate limit exceeded
- ✅ **Facebook Error Code 190**: Invalid/expired token
- ✅ **Facebook Error Code 100**: Invalid parameters
- ✅ **HTTP 429**: Rate limit exceeded
- ✅ **HTTP 403**: Access denied

---

## 🚨 **Προειδοποιήσεις & Περιορισμοί**

### **ΜΗΝ ΚΑΝΕΤΕ:**

1. **Μη κάνετε πολλές κλήσεις ταυτόχρονα**
2. **Μη χρησιμοποιήσετε expired tokens**
3. **Μη κάνετε requests χωρίς proper authentication**
4. **Μη παραβιάσετε τα Facebook App permissions**
5. **Μη κάνετε scraping ή bulk data extraction**

### **ΠΡΕΠΕΙ ΝΑ ΚΑΝΕΤΕ:**

1. **Χρησιμοποιήστε μόνο τα απαραίτητα permissions**
2. **Ελέγξτε τα tokens πριν από κάθε κλήση**
3. **Παρακολουθήστε τα error logs**
4. **Χρησιμοποιήστε το test endpoint πρώτα**
5. **Κάντε gradual testing** με μικρά datasets

---

## 🔧 **Testing & Monitoring**

### **Test Endpoint:**
```
GET /api/v1/facebook/test
```
- Ελέγχει τη σύνδεση
- Κάνει μία μόνο κλήση API
- Επιστρέφει status και campaign count

### **Monitoring:**
- **Rate limit logs** στο console
- **Facebook error logs** με details
- **Token expiration warnings**
- **API call success/failure tracking**

---

## 📊 **Facebook API Limits**

### **Official Facebook Limits:**
- **App-level**: 200 calls/hour
- **User-level**: 100 calls/hour  
- **Ad Account**: 1000 calls/hour

### **Our Conservative Limits:**
- **User-level**: 10 calls/minute (600/hour)
- **Safe margin**: 40% κάτω από το Facebook limit
- **Automatic throttling**: Αν υπερβείτε το όριο

---

## 🛠️ **Troubleshooting**

### **Συνήθη Προβλήματα:**

1. **"Rate limit exceeded"**
   - Περιμένετε 1 λεπτό
   - Μειώστε τη συχνότητα κλήσεων
   - Χρησιμοποιήστε caching

2. **"Invalid access token"**
   - Εκτελέστε ξανά το OAuth flow
   - Ελέγξτε αν το token λήγει
   - Δοκιμάστε το test endpoint

3. **"Access denied"**
   - Ελέγξτε τα App permissions
   - Βεβαιωθείτε ότι το Ad Account είναι σωστό
   - Ελέγξτε αν το token έχει τα σωστά scopes

### **Emergency Procedures:**

1. **Αν πάρετε rate limit:**
   - Περιμένετε 5-10 λεπτά
   - Μειώστε το load
   - Ελέγξτε τα logs

2. **Αν πάρετε access denied:**
   - Ελέγξτε τα Facebook App settings
   - Επιβεβαιώστε τα permissions
   - Δοκιμάστε με νέο token

3. **Αν πάρετε invalid parameters:**
   - Ελέγξτε τα query parameters
   - Βεβαιωθείτε ότι τα IDs είναι σωστά
   - Χρησιμοποιήστε το Graph API Explorer για testing

---

## 🔒 **Production Security**

### **Environment Variables:**
```env
# Απαραίτητα για production
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_AD_ACCOUNT_ID=act_123456789

# Προαιρετικά (για fallback)
FACEBOOK_ACCESS_TOKEN=your_long_lived_token
```

### **Database Security:**
- **Encrypt tokens** σε production
- **Regular backups** των tokens
- **Access logging** για όλες τις κλήσεις

### **Monitoring:**
- **API call monitoring**
- **Error rate tracking**
- **Rate limit alerts**
- **Token expiration warnings**

---

## 📞 **Support & Emergency**

### **Αν αντιμετωπίσετε προβλήματα:**

1. **Ελέγξτε τα logs** στο server console
2. **Δοκιμάστε το test endpoint**
3. **Επιβεβαιώστε τα environment variables**
4. **Ελέγξτε τα Facebook App settings**

### **Emergency Contacts:**
- **Facebook Developer Support**: https://developers.facebook.com/support/
- **Facebook Business Support**: https://www.facebook.com/business/help

---

## ✅ **Checklist πριν από Production**

- [ ] Facebook App permissions ρυθμισμένα
- [ ] Environment variables σωστά
- [ ] Rate limiting ενεργό
- [ ] Error handling λειτουργικό
- [ ] Test endpoint λειτουργεί
- [ ] Database migration εφαρμοσμένο
- [ ] Logs monitoring ενεργό
- [ ] Backup strategy έτοιμο

---

**⚠️ ΣΗΜΑΝΤΙΚΟ: Αυτός ο οδηγός είναι κρίσιμος για την ασφάλεια των επαγγελματικών σας λογαριασμών. Ακολουθήστε όλες τις οδηγίες προσεκτικά.** 