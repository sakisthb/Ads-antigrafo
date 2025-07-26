# Meta Ads API Backend Proxy Setup Guide

## Επισκόπηση

Η εφαρμογή Ads Pro χρησιμοποιεί ένα ασφαλές backend proxy για την επικοινωνία με το Facebook Ads API. Αυτό σημαίνει ότι:

- ✅ Τα access tokens διατηρούνται με ασφάλεια στο backend
- ✅ Το frontend δεν έχει άμεση πρόσβαση στα Facebook credentials
- ✅ Όλες οι κλήσεις API περνάνε από το δικό μας API
- ✅ Καλύτερος έλεγχος και ασφάλεια
- ✅ **Multi-user support** - κάθε χρήστης έχει το δικό του Facebook token
- ✅ **Αυτόματη διαχείριση tokens** - αποθήκευση και ανανέωση

## Βήματα Ρύθμισης

### 1. Facebook App Setup

1. **Επισκεφθείτε το [Facebook Developer Portal](https://developers.facebook.com/apps/)**
2. **Δημιουργήστε ένα νέο App** ή χρησιμοποιήστε υπάρχον
3. **Προσθέστε το Facebook Login product**
4. **Ρυθμίστε τα OAuth redirect URIs** (π.χ. `http://localhost:5900/api/v1/facebook/oauth/callback`)

### 2. Facebook App Permissions

Το Facebook App σας χρειάζεται τα παρακάτω permissions:

```
- ads_management (για ανάγνωση καμπανιών)
- ads_read (για ανάγνωση δεδομένων)
- business_management (για πρόσβαση σε business accounts)
```

### 3. Environment Variables

Προσθέστε τις παρακάτω μεταβλητές στο `.env` αρχείο του backend:

```env
# Facebook App Credentials
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Facebook Access Token (για fallback/admin use)
FACEBOOK_ACCESS_TOKEN=your_long_lived_access_token

# Facebook Ad Account ID
FACEBOOK_AD_ACCOUNT_ID=act_123456789

# Backend API URL (για frontend)
VITE_API_URL=http://localhost:5900/api/v1
```

**Frontend (.env):**
```env
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_API_URL=http://localhost:5900/api/v1
```

### 4. Database Setup

Ο πίνακας `facebook_tokens` δημιουργείται αυτόματα με το migration. Περιλαμβάνει:

```sql
CREATE TABLE facebook_tokens (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  access_token VARCHAR(512) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### 5. Access Token Generation

#### Μέθοδος 1: OAuth Flow (Προτεινόμενη)
1. Συνδεθείτε στην εφαρμογή
2. Πηγαίνετε στο Settings → Facebook
3. Πατήστε "Σύνδεση με Facebook"
4. Ολοκλήρωστε το OAuth flow
5. Το token αποθηκεύεται αυτόματα στη βάση

#### Μέθοδος 2: Graph API Explorer (Γρήγορη)
1. Επισκεφθείτε το [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Επιλέξτε το App σας
3. Προσθέστε τα permissions: `ads_management`, `ads_read`, `business_management`
4. Κάντε κλικ "Generate Access Token"
5. Αντιγράψτε το token

#### Μέθοδος 3: Long-lived Token (Για admin)
1. Ακολουθήστε τη Μέθοδο 2
2. Χρησιμοποιήστε το Graph API Explorer για να μετατρέψετε το token σε long-lived:
   ```
   GET /oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}
   ```

### 6. Ad Account ID

Για να βρείτε το Ad Account ID σας:

1. Επισκεφθείτε το [Facebook Ads Manager](https://www.facebook.com/adsmanager/)
2. Επιλέξτε το Ad Account σας
3. Το ID εμφανίζεται στη διεύθυνση URL: `act_123456789`
4. Αντιγράψτε το πλήρες ID (συμπεριλαμβανομένου του `act_`)

## API Endpoints

Μετά τη ρύθμιση, τα παρακάτω endpoints θα είναι διαθέσιμα:

```
GET  /api/v1/facebook/test                    # Έλεγχος σύνδεσης
POST /api/v1/facebook/refresh-token           # Ανανέωση token
GET  /api/v1/facebook/oauth/callback          # OAuth callback
GET  /api/v1/facebook/campaigns               # Λίστα καμπανιών
GET  /api/v1/facebook/campaigns/{id}/insights # Insights καμπανιάς
GET  /api/v1/facebook/campaigns/{id}/adsets   # Ad Sets καμπανιάς
GET  /api/v1/facebook/adsets/{id}/ads         # Ads ad set
GET  /api/v1/facebook/account/insights        # Account-level insights
```

## Multi-User Support

### Πώς λειτουργεί:

1. **Κάθε χρήστης συνδέεται** με το δικό του Facebook account
2. **Το token αποθηκεύεται** στη βάση με το user_id
3. **Τα API calls** χρησιμοποιούν το σωστό token ανά χρήστη
4. **Αυτόματη ανανέωση** όταν το token λήγει

### Authentication Requirements:

- Όλα τα Facebook endpoints απαιτούν authentication
- Το OAuth flow απαιτεί συνδεδεμένο χρήστη
- Τα tokens αποθηκεύονται ανά χρήστη

## Token Management

### Αυτόματη Διαχείριση:

- **Έλεγχος λήξης**: Το backend ελέγχει αν το token λήγει
- **Αυτόματη ανανέωση**: Προσπάθεια ανανέωσης όταν λήγει
- **Re-authentication**: Ειδοποίηση αν χρειάζεται νέα σύνδεση

### Token Lifecycle:

- **Short-lived tokens**: 1-2 ώρες
- **Long-lived tokens**: 60 μέρες
- **Αυτόματη αποθήκευση**: Στη βάση με expiration date

## Ασφάλεια

### Best Practices

1. **Μη αποθηκεύετε tokens στο frontend**
2. **Χρησιμοποιήστε environment variables**
3. **Κανονικά ανανεώστε τα tokens**
4. **Περιορίστε τα permissions στο minimum απαραίτητο**
5. **Αποθηκεύετε tokens με κρυπτογράφηση** (για production)

### Token Storage

- **Development**: Απλή αποθήκευση στη βάση
- **Production**: Κρυπτογραφημένη αποθήκευση
- **Backup**: Regular backups των tokens

## Troubleshooting

### Συνήθη Προβλήματα

1. **"Authentication required"**
   - Βεβαιωθείτε ότι είστε συνδεδεμένοι
   - Ελέγξτε αν το auth middleware λειτουργεί

2. **"Facebook access token not available"**
   - Εκτελέστε το OAuth flow
   - Ελέγξτε αν το token αποθηκεύθηκε στη βάση

3. **"Facebook Ad Account ID not configured"**
   - Ελέγξτε αν το `FACEBOOK_AD_ACCOUNT_ID` είναι σωστό
   - Βεβαιωθείτε ότι περιλαμβάνει το `act_` prefix

4. **"Insufficient permissions"**
   - Επιβεβαιώστε ότι το App έχει τα απαραίτητα permissions
   - Ελέγξτε αν το token έχει τα σωστά scopes

### Testing

Χρησιμοποιήστε το "Test Connection" button στο Settings για να ελέγξετε τη σύνδεση.

## Μελλοντικές Βελτιώσεις

1. **Enhanced OAuth Flow**: Αυτόματη διαχείριση tokens
2. **Token Encryption**: Κρυπτογραφημένη αποθήκευση
3. **Multi-account Support**: Υποστήριξη πολλαπλών ad accounts
4. **Rate Limiting**: Προστασία από API limits
5. **Caching**: Cache αποτελεσμάτων για καλύτερη απόδοση
6. **Webhook Support**: Real-time ενημερώσεις από Facebook

## Χρήσιμοι Σύνδεσμοι

- [Facebook Developer Portal](https://developers.facebook.com/apps/)
- [Facebook Ads Manager](https://www.facebook.com/adsmanager/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Facebook Marketing API Documentation](https://developers.facebook.com/docs/marketing-apis/)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) 