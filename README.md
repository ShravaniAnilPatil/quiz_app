# Quiz Application

This is a dynamic quiz application built with React, featuring CSV integration for question data, difficulty selection, real-time progress tracking, and user performance reporting.

---

## Features

### 1. **Difficulty Level Selection**
- Users can choose between three difficulty levels: **Easy**, **Medium**, and **Hard**.
- The selected difficulty filters relevant questions from the CSV file.

### 2. **CSV Integration**
- Question data is stored in a CSV file and parsed dynamically using `PapaParse`.
- Questions are filtered by subject and difficulty level.

### 3. **Dynamic Question Rendering**
- Questions and their respective options are displayed dynamically.
- Users can select answers by clicking on the options.


  
### 4. **Progress Tracking**
- Tracks:
  - Number of questions attempted.
  - Number of correct answers.
  - Final score as a percentage.
- Displays the score upon quiz completion.

### 5. **User Reports**
- Performance is recorded in a `userreport.csv` file.
- Includes:
  - Total attempts.
  - Correct answers.
  - Accuracy percentage.
  - Average score percentage.
- Updates user-specific data or creates a new record if the user doesn’t exist.

### 6. **Quiz Submission**
- Sends quiz results to a backend API for further processing.
- Includes:
  - Username.
  - Score.
  - Difficulty level.
  - Subject.
