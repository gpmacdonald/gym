# iOS Safari Testing Checklist

## Prerequisites
- iPhone or iPad with iOS 15+ (or Mac with Safari for initial testing)
- Local dev server running: `npm run dev`
- Device on same network as dev machine

## Accessing the App on iOS

### Option 1: Local Network (Recommended for Testing)
1. Find your computer's local IP address:
   - Windows: `ipconfig` → look for IPv4 Address (e.g., 192.168.1.100)
   - Mac: System Preferences → Network → Wi-Fi → IP Address
2. Start the dev server with host flag: `npm run dev -- --host`
3. On iPhone/iPad, open Safari and go to: `http://YOUR_IP:5173`

### Option 2: ngrok (For Remote Testing)
1. Install ngrok: `npm install -g ngrok`
2. Run: `ngrok http 5173`
3. Use the provided https URL on iOS

## Testing Checklist

### 1. Basic Functionality ✓/✗
- [ ] App loads without errors
- [ ] Can navigate between all pages (Home, Progress, Exercises, Settings)
- [ ] Dark mode toggle works
- [ ] Theme persists on reload

### 2. Workout Logging
- [ ] Can start a new workout
- [ ] Exercise selector opens and filters work
- [ ] Can add sets with weight and reps
- [ ] Rest timer works (audio notification plays)
- [ ] Can save workout successfully
- [ ] Workout appears in activity list

### 3. Cardio Logging
- [ ] Can log treadmill session
- [ ] Can log stationary bike session
- [ ] Duration input works correctly
- [ ] Sessions appear in activity list

### 4. PWA Features
- [ ] Install prompt appears after first workout
- [ ] iOS-specific instructions are shown (Share → Add to Home Screen)
- [ ] App can be added to home screen
- [ ] App opens in standalone mode from home screen
- [ ] Splash screen displays correctly
- [ ] Status bar style looks correct

### 5. Offline Mode
- [ ] Put device in airplane mode
- [ ] Offline indicator banner appears
- [ ] Previously loaded data is still accessible
- [ ] Can navigate between pages
- [ ] Can log new workout while offline
- [ ] Data syncs when back online

### 6. Touch & Gestures
- [ ] All buttons have adequate touch targets (no mis-taps)
- [ ] Scrolling is smooth in all lists
- [ ] No horizontal scroll on any page
- [ ] Keyboard appears for number inputs
- [ ] Form inputs don't zoom in (font-size >= 16px)

### 7. Safe Areas
- [ ] Content not hidden by notch on iPhone X+
- [ ] Bottom nav doesn't overlap with home indicator
- [ ] Scroll content visible under safe areas

### 8. Visual Issues
- [ ] No layout shifts or flickering
- [ ] Dark mode renders correctly
- [ ] Charts render and are interactive
- [ ] All icons display properly
- [ ] No text truncation issues

### 9. Performance
- [ ] Initial load time acceptable (< 3s)
- [ ] Page transitions are smooth
- [ ] No lag when typing in search
- [ ] Scrolling is 60fps smooth

## Known iOS Safari Quirks to Watch For

1. **100vh issue**: Viewport height includes address bar - use `dvh` or CSS env() instead
2. **Rubber-banding**: Over-scroll bounce effect - may affect fixed elements
3. **Audio autoplay**: Requires user interaction before playing sounds
4. **Date inputs**: Native date picker styling differs
5. **Position fixed**: Can be janky during keyboard open/close
6. **Input zoom**: Inputs with font-size < 16px cause page zoom

## Reporting Issues

If you find issues, note:
1. Device model and iOS version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshot/video if possible

## After Testing

Report results and I'll address any iOS-specific fixes needed.
