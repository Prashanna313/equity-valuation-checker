# Stock Valuation Methodology
## Based on Revenue Growth + Exit Multiple Model

### VALUATION METHOD: Revenue-Based DCF with Exit Multiple

---

## INPUT DATA NEEDED:
1. **Current Year Revenue**: Fetch from API
2. **Assumed Growth Rates**: 5%, 10%, 20%, 30%, 50%
3. **Exit Multiple**: 5x (applied to Year 10 revenue)
4. **Discount Rate**: 10% (annual discount factor)
5. **Current Market Cap**: Fetch from API

---

## CALCULATION STEPS:

### Step 1: Get Current Year Revenue
```
Current_Revenue = [Latest Annual Revenue]
```

### Step 2: Project Sales for Next 10 Years (for each growth rate scenario)
```
For each growth_rate in [5%, 10%, 20%, 30%, 50%]:
    Year 1 Revenue = Current_Revenue × (1 + growth_rate)
    Year 2 Revenue = Year 1 Revenue × (1 + growth_rate)
    Year 3 Revenue = Year 2 Revenue × (1 + growth_rate)
    ...
    Year 10 Revenue = Year 9 Revenue × (1 + growth_rate)
```

**Example (Lenskart @ 5% growth):**
- Current: ₹100 Cr
- Year 1: 100 × 1.05 = ₹105 Cr
- Year 2: 105 × 1.05 = ₹110.25 Cr
- ...
- Year 10: ₹162.89 Cr

### Step 3: Calculate Exit Value at Year 10
```
Exit_Value = Year_10_Revenue × 5x_Multiple
```

**Example:**
- Year 10 Revenue: ₹162.89 Cr
- Exit Value: 162.89 × 5 = ₹814.45 Cr

### Step 4: Discount Back to Present Value
```
Discount_Factor = 1 / (1 + discount_rate)^year

For each year 1 to 10:
    Discounted_Value_of_Exit = Exit_Value / (1 + discount_rate)^10
```

**Using 10% discount rate:**
- Discount Factor for Year 10 = 1 / (1.10)^10 = 0.3855
- Present Value of Exit = 814.45 × 0.3855 = ₹314.16 Cr

### Step 5: Calculate Fair Valuation
```
Fair_Valuation = Present_Value_of_Exit
```

### Step 6: Compare with Market Cap
```
Current_Market_Cap = [Fetch from API]

Valuation_Difference = Fair_Valuation - Current_Market_Cap
Overvalued_Percentage = (Current_Market_Cap - Fair_Valuation) / Fair_Valuation × 100

If Fair_Valuation > Current_Market_Cap:
    Status = "UNDERVALUED"
    Upside = (Fair_Valuation - Current_Market_Cap) / Current_Market_Cap × 100

Else If Fair_Valuation < Current_Market_Cap:
    Status = "OVERVALUED"
    Downside = (Current_Market_Cap - Fair_Valuation) / Current_Market_Cap × 100

Else:
    Status = "FAIRLY VALUED"
```

---

## VALUATION SCENARIOS:

| Growth Rate | Year 10 Revenue | Exit Value (5x) | Present Value (10% discount) | Fair Valuation |
|-------------|-----------------|-----------------|------------------------------|----------------|
| 5%          | Current × 1.629 | Exit × 5        | Exit × 0.3855               | PV             |
| 10%         | Current × 2.594 | Exit × 5        | Exit × 0.3855               | PV             |
| 20%         | Current × 6.192 | Exit × 5        | Exit × 0.3855               | PV             |
| 30%         | Current × 13.79 | Exit × 5        | Exit × 0.3855               | PV             |
| 50%         | Current × 57.67 | Exit × 5        | Exit × 0.3855               | PV             |

---

## OUTPUT DISPLAY:

### For Each Growth Rate Scenario:
```
Growth Rate: 5%
├─ Year 10 Revenue Projection: ₹162.89 Cr
├─ Exit Value (5x multiple): ₹814.45 Cr
├─ Present Value (Discounted): ₹314.16 Cr
├─ Fair Valuation: ₹314.16 Cr
├─ Current Market Cap: ₹400 Cr
├─ Status: OVERVALUED
└─ Overvaluation: 27.4%

Growth Rate: 10%
├─ Year 10 Revenue Projection: ₹259.4 Cr
├─ Exit Value (5x multiple): ₹1,297 Cr
├─ Present Value (Discounted): ₹500.2 Cr
├─ Fair Valuation: ₹500.2 Cr
├─ Current Market Cap: ₹400 Cr
├─ Status: UNDERVALUED
└─ Upside: 25.0%

... [and so on for 20%, 30%, 50%]
```

### Summary Table:
Show all scenarios side-by-side with color coding:
- 🔴 Overvalued (Red)
- 🟢 Undervalued (Green)
- 🟡 Fairly Valued (Yellow)

---

## INTERPRETATION GUIDE:

| Scenario | Meaning |
|----------|---------|
| All scenarios undervalued | Stock is likely good value across multiple growth assumptions |
| Mix of over/undervalued | Stock valuation depends heavily on growth rate |
| All scenarios overvalued | Stock is expensive even with optimistic growth |
| Lower growth rates overvalued, higher undervalued | Market expects high growth |

---

## SPECIAL CASES / EDGE CONDITIONS:

1. **Negative or Zero Growth**
   - Not applicable; skip in scenarios

2. **Companies with Losses**
   - Flag warning: "Revenue model not suitable; company unprofitable"
   - Still show calculations but with disclaimer

3. **Startup/Early Stage (limited revenue history)**
   - Use available data; note: "Limited historical data"

4. **Data Not Available**
   - Show: "Market cap data not available for this stock"

5. **Currency Handling**
   - Convert all to same currency (INR for India, USD for Global, or user preference)
   - Display exchange rate used

---

## ASSUMPTIONS TO DOCUMENT IN UI:

- Discount Rate: 10% (annual)
- Exit Multiple: 5x (on Year 10 revenue)
- Time Horizon: 10 years
- All calculations in annual compounding

**User can adjust these in advanced settings**

---

## SENSITIVITY ANALYSIS (Optional Enhancement):

Users could adjust:
- Discount Rate: 8%, 10%, 12%, 15%
- Exit Multiple: 3x, 5x, 7x, 10x
- Time Horizon: 5, 10, 15 years

This would create a matrix showing how valuation changes.