# Users Module Integration - Implementation Plan

## ✅ **Completed Features**

### **1. Backend Integration**
- **File**: `src/api/adminClient.ts`
- **Method**: Added `getUsers()` to fetch from `/api/v1/users`
- **Type Definition**: Added `User` interface matching the provided backend structure:
    - Basic Info (Name, Age, Gender)
    - Physical Stats (Height, Weight, Activity)
    - Goal Preferences (Weight Goal, Diet, Allergies)
    - Timestamps

### **2. Frontend Logic**
- **File**: `src/pages/UsersPage.tsx`
- **State Management**:
    - `users`: Stores fetched user list
    - `isLoading`: Handles loading states
    - `searchTerm`: Client-side search by name
    - `filterGender`: Filter by Male/Female/All
    - `filterGoal`: Filter by Weight Goal (Loss/Gain/Maintain)
- **Stats Calculation**:
    - Dynamic stats for Total Users, Active Goals, and Goal Splits derived from fetched data.

### **3. UI / UX Enhancements**
- **Theme**: Premium Orange Theme (`#FF7A18`) applied consistently.
- **Top Stats Cards**:
    - Total Users (with Gender split)
    - Active Goals (Total targeting change)
    - Goal Split (Loss vs Gain vs Maintain)
- **User List Design**:
    - **Hybrid Card-Table**: Rows look like cards but align like a table.
    - **Columns**:
        - **Profile**: Avatar, Name, Gender, Age
        - **Stats**: Height, Weight, Activity Level (Badge)
        - **Goals**: Weight Goal (Color-coded badge), Diet Type, Allergies
        - **Meta**: Joined Date
- **Interactions**:
    - Hover effects with orange glow
    - Smooth transitions

### **4. Components**
- **UserRow**: `src/components/UserRow.tsx`
    - Reusable component for individual user rows.
    - Handles data formatting (Initials, Dates).
    - Status badges for Activity and Goals.

---

## 📁 **Files Created/Modified**

| File | Status | Description |
|------|--------|-------------|
| `src/api/adminClient.ts` | Modified | Added `getUsers` API & Types |
| `src/pages/UsersPage.tsx` | Rewritten | Full logic & UI implementation |
| `src/pages/UsersPage.css` | Rewritten | Premium styling & Grid layouts |
| `src/components/UserRow.tsx` | Created | Row component for user list |

---

## 🚀 **Next Steps**

1. **User Details Drawer**: 
   - Currently, clicking a row logs to console (`View user`).
   - Can be expanded to show a full-height side drawer with detailed JSON structure.
2. **Pagination**:
   - Current implementation handles all users in one list (client-side filtering).
   - Server-side pagination can be added if user count grows > 50.
3. **Edit Functionality**:
   - Add `updateUser` to API if admin editing is required.

## 🎨 **Visual Structure**

```
[ Header: Users Management ]
[ Stats: Total Users | Active Goals | Goal Split ]
[ Controls: Search | Filter Gender | Filter Goal | Export ]

[ Grid Header ]
[ User Row 1 ] -> Avatar | Name | Height/Weight | Goal Badge | Date
[ User Row 2 ] -> ...
[ User Row 3 ] -> ...
```
