# **Interactive Maths & Science Quiz**

## **📖 Description**

This project is a fully interactive and responsive quiz application built with HTML, CSS, and vanilla JavaScript. It provides a fun and engaging way for users, specifically 5th-grade students, to test their knowledge in Maths and Science. The application features multiple question types, difficulty levels, a timer, and a theme switcher.

## **✨ Features**

* **Two Difficulty Levels:** Users can choose between "Easy" and "Hard" modes, each with its own set of 5 questions.  
* **Multiple Question Types:** The quiz supports:  
  * Single-select multiple choice  
  * Multi-select multiple choice  
  * Fill-in-the-blank questions  
* **Question Timer:** Each question has a 15-second timer to add a layer of challenge. If the timer runs out, the quiz automatically proceeds to the next question.  
* **Input Validation:** Prevents users from moving to the next question without providing an answer.  
* **Light & Dark Mode:** A theme switcher allows users to toggle between a light and a dark theme for better visual comfort. The user's preference is saved in their browser.  
* **Previous/Next Navigation:** Users can navigate backward and forward to review or change their answers before finishing.  
* **Final Score & Answer Review:** At the end of the quiz, users see their final score and have the option to review all questions, their answers, and the correct answers.  
* **Responsive Design:** The layout is fully responsive and works well on desktops, tablets, and mobile devices.

## **📂 File Structure**

The project consists of three main files:

* **index.html**: This file contains the HTML structure for all the screens of the quiz, including the difficulty selection, the main quiz content area, and the results screen.  
* **style.css**: This file handles all the styling for the application. It includes a modern, clean design with variables for easy theme customization (both light and dark modes).  
* **script.js**: This is the core of the application. It contains all the logic for:  
  * Managing the quiz state (questions, answers, score).  
  * Handling user interactions (button clicks, answer selections).  
  * Controlling the timer.  
  * Switching between screens.  
  * Displaying the final results and answer summary.

## **🚀 How to Use**

1. **Download the files:** Make sure you have index.html, style.css, and script.js in the same folder.  
2. **Open index.html:** Open the index.html file in any modern web browser (like Chrome, Firefox, or Edge).  
3. **Select a Difficulty:** Choose either "Easy" or "Hard" to begin the quiz.  
4. **Answer the Questions:** Answer each question within the 15-second time limit.  
5. **View Your Results:** Once you finish, your score will be displayed. You can choose to "Try Again," "Go Back to Home," or "Show Answers" to review your performance.

## **🛠️ Customization**

### **Changing the Questions**

The questions are stored in two arrays at the top of the script.js file: easyQuestions and hardQuestions.

To change the questions, simply edit the content of these arrays. You can change the question text, the options, and the correct answer.

**Example Question Object:**

{  
    question: "What is 2 \+ 2?", // The question text  
    type: 'single-select',       // 'single-select', 'multi-select', or 'fill-in-the-blank'  
    options: \['3', '4', '5', '6'\], // Options for multiple choice  
    answer: '4'                  // The correct answer  
}

For multi-select questions, the answer should be an array of strings:

{  
    question: "Which of these are states of matter?",  
    type: 'multi-select',  
    options: \['Solid', 'Liquid', 'Light', 'Gas'\],  
    answer: \['Solid', 'Liquid', 'Gas'\] // Correct answers in an array  
}

### **Changing the Theme**

The colors for both the light and dark themes are defined as CSS variables at the top of the style.css file. You can easily change the entire look and feel of the quiz by modifying these color values.

**Light Theme Variables (in :root):**

:root {  
    \--primary-color: \#F0F4F8;  
    \--container-bg: \#FFFFFF;  
    \--secondary-color: \#102A43;  
    \--accent-color: \#3366FF;  
    /\* ... and so on \*/  
}

**Dark Theme Variables (in body\[data-theme="dark"\]):**

body\[data-theme="dark"\] {  
    \--primary-color: \#102A43;  
    \--container-bg: \#243B53;  
    \--secondary-color: \#F0F4F8;  
    \--accent-color: \#5893FF;  
    /\* ... and so on \*/  
}  
