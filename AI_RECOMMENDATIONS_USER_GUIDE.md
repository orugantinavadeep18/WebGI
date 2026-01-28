# 🎯 AI Rental Recommendations - User Guide

## Welcome! 👋

This guide will help you navigate and use the AI-powered rental recommendation system on our platform.

---

## 🚀 Getting Started

### Step 1: Access the Recommendations Page
1. Log in to your account (if needed)
2. Click the **menu icon** (☰) in the header
3. Select **"🎯 AI Recommendations"**
4. Or navigate directly to: `/recommendations`

### Step 2: See Your Dashboard
You'll see:
- **Left Sidebar:** All your filter options
- **Right Side:** Recommended rental properties

---

## 🔍 How to Search

### Setting Filters

#### 1. **Budget (💰)**
- Use the slider to set your maximum rent
- Range: ₹1,000 - ₹10,000
- Default: ₹5,000
- *Rentals above this price will have lower scores*

#### 2. **Location (📍)**
- Type your city or area name
- Example: "hyderabad", "bangalore"
- Leave blank for all locations

#### 3. **Gender Preference (👕)**
- **Unisex:** Open to anyone
- **Male:** Male residents only
- **Female:** Female residents only

#### 4. **Sharing Type (👥)**
- **All Types:** Any arrangement
- **Single Room:** Just you
- **Double Sharing:** Share with 1 person
- **Triple Sharing:** Share with 2 people
- **Multi Sharing:** Shared dorm-style

#### 5. **Property Type (🏠)**
- **All Types:** No preference
- **Hostel:** Dormitory-style
- **PG:** Paying guest houses
- **Others:** Other arrangements

#### 6. **Amenities (🏠)**
Select the facilities you need:
- **📡 WiFi** - High-speed internet
- **🍽️ Food** - Meals included
- **❄️ AC** - Air conditioning
- **🅿️ Parking** - Vehicle parking space
- **🧺 Laundry** - Washing services
- **⚡ Power Backup** - Backup generators
- **🔒 Security** - Security staff
- **📹 CCTV** - Video surveillance

*More amenities = Higher match score*

### Step 3: Click "Search Rentals"
- The AI will analyze all properties
- Results appear instantly (< 1 second)
- See up to 12 best matches

---

## 📊 Understanding the Results

### Each Property Card Shows:

```
┌─────────────────────────────────┐
│  Property Name                  │ ❤️ (Save Button)
│  📍 Location                    │
├─────────────────────────────────┤
│  Price: ₹4,500  ⭐ Rating: 3.5 │
├─────────────────────────────────┤
│  Match Score                    │
│  ████████░░ 82/100             │
├─────────────────────────────────┤
│  Type: Hostel  | Capacity: 2    │
│  Vacancies: 1  | Sharing: Single│
├─────────────────────────────────┤
│  📡 WiFi  🍽️ Food  ⚡ Power  🔒 │
│  Available Amenities            │
├─────────────────────────────────┤
│         [View Details Button]   │
└─────────────────────────────────┘
```

### What is "Match Score"?

The AI gives each property a score from **0-100** based on:

```
💰 Price Match     - How close to your budget
⭐ Rating         - Quality from past users
🏠 Amenities      - Matches your requirements
📍 Availability   - How many spaces left
👥 Capacity       - Can accommodate you

Example:
Price:    ★★★★★ 25/25
Rating:   ★★★★★ 25/30
Amenities:★★★★☆ 20/25
Vacancy:  ★★★☆☆  9/15
Capacity: ★★★★★  5/5
──────────────────────
TOTAL:          84/100 ✓ Great Match!
```

### Color Coding

| Score | Status | Color |
|-------|--------|-------|
| 85-100 | Perfect Match! | 🟢 Green |
| 70-84 | Great Option | 🟡 Yellow |
| 55-69 | Good Choice | 🟠 Orange |
| <55 | May Not Fit | 🔴 Red |

---

## ❤️ Saving Your Favorites

### How to Save a Rental:
1. Find a property you like
2. Click the **❤️ Heart Icon** in the top-right corner
3. Icon turns **red** = Saved! ✓
4. See "Added to saved rentals" notification

### Where to View Saved Rentals:
1. Click the **menu** (☰)
2. Select **"Saved Properties"**
3. Or navigate to: `/saved`

### Your Saved Rentals:
- Store locally on your device
- Don't need internet to view
- Can delete anytime by clicking the heart again
- Persist even after closing browser

---

## 🎯 Pro Tips

### Tip 1: Filter Smart
```
❌ Too Strict: WiFi + Food + AC + Parking + Laundry + Security + CCTV
   → Might find only 1-2 properties

✅ Balanced: WiFi + Food + AC
   → Find 20-30 great options

✅ Flexible: WiFi only
   → Find 50+ properties to choose from
```

### Tip 2: Adjust Budget
```
If getting no results:
1. Increase your max budget by ₹500
2. Remove one "must-have" amenity
3. Check different location
```

### Tip 3: Read Ratings
```
Rating System:
⭐⭐⭐⭐⭐ (5.0) - Excellent!
⭐⭐⭐⭐☆ (4.0) - Very Good
⭐⭐⭐☆☆ (3.0) - Good
⭐⭐☆☆☆ (2.0) - Average
⭐☆☆☆☆ (1.0) - Poor
NEW - New property (no rating yet)
```

### Tip 4: Check Vacancies
```
Vacancies = Available spaces right now
0 = Currently full (might get space soon)
1 = One space available
3+ = Good availability
```

### Tip 5: Mobile Friendly
- Works perfectly on phones
- Filters slide below results
- Touch-friendly buttons
- Full functionality preserved

---

## 🔄 Typical Search Workflow

### Scenario 1: Budget-Conscious Student
```
1. Set Budget: ₹2,500
2. Location: "hyderabad"
3. Amenities: WiFi (most important)
4. Result: 15+ budget-friendly options with WiFi
5. Action: Save 3-4 favorites, visit top 2
```

### Scenario 2: Professional Looking for Premium
```
1. Set Budget: ₹8,000
2. Amenities: WiFi + Food + AC + Parking
3. Sharing: Single Room
4. Result: 5-8 premium options
5. Action: Save all, call owners for viewing
```

### Scenario 3: Group Looking for Shared Space
```
1. Set Budget: ₹5,000
2. Sharing: Triple or Multi
3. Amenities: WiFi + Laundry + Security
4. Result: 20+ shared space options
5. Action: Check capacities, contact best matches
```

---

## ❓ Frequently Asked Questions

### Q: Why are some results low-scoring?
**A:** The AI considers:
- Price being higher than preferred
- Fewer amenities than requested
- Lower user ratings
- Higher prices

Try adjusting filters to improve scores.

### Q: Can I search without filters?
**A:** Yes! Click "Search Rentals" with default filters to see all 150+ properties ranked by AI.

### Q: Are ratings from real users?
**A:** Ratings are based on actual user experiences. New properties show "NEW" instead of a rating.

### Q: How is the AI score calculated?
**A:** It's a smart algorithm considering:
1. Price vs. your budget
2. User ratings
3. Your required amenities
4. Available spaces
5. Property capacity

### Q: Can I see property details?
**A:** Click the "[View Details]" button on any property card to see:
- Full description
- All amenities
- Owner information
- Contact details
- Rules and policies

### Q: Are saved rentals private?
**A:** Yes! Saved rentals are stored only on your device (localStorage). They're not shared with anyone.

### Q: What if I find a perfect property?
**A:** Once you've found your match:
1. Click "View Details" for contact info
2. Note the phone number or email
3. Reach out to the owner directly
4. Arrange property viewing
5. Ask questions before committing

---

## 🚨 Troubleshooting

### Problem: "No results found"
**Solutions:**
1. Increase your budget slider
2. Remove some amenity requirements
3. Try a different location
4. Check that MongoDB is connected

### Problem: All results have low scores (<50)
**Reasons & Fixes:**
1. Budget too low → Increase budget
2. Too many amenities required → Reduce to 2-3
3. Very high standards → Adjust expectations
4. Check location spelling

### Problem: Saved rentals disappeared
**Fixes:**
1. Clear browser cache? (This deletes localStorage)
2. Try using the same browser
3. Try on a private/incognito window
4. Save again using the heart button

### Problem: Website is slow
**Try:**
1. Reload the page (Ctrl+R or Cmd+R)
2. Clear browser cache
3. Check internet connection
4. Close other browser tabs
5. Try a different browser

---

## 📞 Getting Help

### For Property Information:
- Click the property card
- Look for contact details
- Call or email the owner directly

### For Website Issues:
- Check browser console (F12 → Console tab)
- Note the error message
- Contact website support

### For Account Issues:
- Try logging out and back in
- Clear browser cookies
- Contact customer support

---

## 💡 Making Your Decision

### Before Committing to a Rental:

**Checklist:**
- [ ] Visit the property in person
- [ ] Check amenities are actually available
- [ ] Meet the owner/manager
- [ ] Ask about lease terms
- [ ] Understand payment terms
- [ ] Ask about utilities included
- [ ] Check house rules
- [ ] Ask about cancellation policy
- [ ] Get everything in writing
- [ ] Take photos/video of property condition

---

## 🎓 Understanding Amenities

### Must-Have (Most Important):
- **WiFi** - Essential for work/study
- **Security** - Peace of mind

### Very Useful:
- **AC** - Comfort in hot areas
- **Water Supply** - Check before committing
- **Parking** - If you have vehicle

### Nice to Have:
- **Food** - Saves time
- **Laundry** - Saves effort
- **Power Backup** - For outages

### Less Critical:
- **CCTV** - Nice but not essential
- **Parking** - If you don't have vehicle

---

## 🌟 Rating Your Experience

After viewing rentals:
1. Come back and save your favorites
2. Note which ones you actually visited
3. Share feedback with others
4. Rate properties you've experienced

---

## 📱 Mobile vs Desktop

### Mobile (Phone):
✓ Full functionality  
✓ Touch-friendly buttons  
✓ Filters stack below  
✓ Easy to carry for showings  

### Desktop/Laptop:
✓ Better overview  
✓ Larger text  
✓ Easier typing  
✓ Multiple windows open  

**Both work perfectly!**

---

## 🎉 You're Ready!

Start searching now:
1. Open the Recommendations page
2. Set your preferences
3. Click "Search Rentals"
4. Browse AI-ranked results
5. Save your favorites
6. Contact properties you like
7. Visit and decide
8. Find your perfect rental! 🏠

---

## 💬 Summary

| Feature | What It Does |
|---------|-------------|
| Budget Slider | Limits properties to your price range |
| Location Filter | Searches specific cities/areas |
| Gender Filter | Matches your living preference |
| Sharing Type | Finds your preferred arrangement |
| Amenities | Matches must-have facilities |
| AI Score | Shows how well it matches your needs |
| Save Button | Bookmark properties for later |
| Match Bar | Visual representation of score |

---

## 📊 Real Example

```
✓ I want: Budget ₹3500, Hostel, WiFi, Single room, Male
✓ My Filters: Max Budget: 3500, Property Type: Hostel, 
              Sharing: Single, Gender: Male, WiFi: Yes
✓ Results: 8 hostels with WiFi under ₹3500
✓ Scores: 45-78 (due to other factors like amenities, ratings)
✓ Action: Save top 3, contact owners for viewing
✓ Outcome: Find perfect hostel, move in! 🎉
```

---

**Happy searching! 🏠✨**

*AI Recommendation System v1.0*  
*Last Updated: January 28, 2026*
