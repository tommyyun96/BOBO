# Project BOBO
GTPD Programming Assessment Phase - Sangjin Yun

- This project was done in 2019 Spring-CS374(Human-Computer Interaction) course at KAIST university in a team of 4.
- Please visit with smartphone! (***optimized for smartphone rendering***)
- URL: https://tommyyun96.github.io/BOBO/
- Git Repo: https://github.com/tommyyun96/BOBO
- Use **ID: test PW: 1234**

## 1. Introduction
- This application is developed for the sake of academy instructors, especially those who teach young students. We pointed out that most of them need (1) customized communication platform among instructors and parents and (2) efficient student management program.

### 2. Description
- There are four tabs: (1) Student list, (2) Adding class record, (3) Notice boards, (4) Settings
- This program keeps two types of data from each student: class record and instructor's note.
- Class record is used to keep track of student's activity.
- Instructor's note is used to share information among instructors.
- Throughout the development, (1), (2) and (3) were fully implemented.
#### 2.1 Student list
- Displays the list of students attending the academy.
- The user can filter students by class or search directly with the support of autocomplete unitiliy.
- Student profile can be accessed by clicking on the list.
#### 2.2 Adding class record
- The user can upload photos by taking picture or from the gallery.
- The user can set hashtags with '#' keyword. In the student's class record page, items ca be filtered with this hashtag.
#### 2.3 Notice Boards
- Notice boards for instructors and parents.

## 2. Libraries and frameworks
- React (-dom, -router, js-popup)
- Materialize
- Firebase

## 3. Appendix: Source Description
#### src/App.js
Connect different pages

#### src/Login.js
Showing initial login page

#### src/Menu.js
Showing below menu bar

#### src/Topbar.js
Showing topbar which tells current position

#### src/Notices/Board.js src/Notices/Notice.js
Get boards and notices from firebase

#### src/Notices/AddBoard.js src/Notices/AddNotice.js
Make new board and notice

#### src/Notices/BoardList.js
Show only valid boardlist to current user

#### src/Notices/BoardListItem.js src/Notices/NoticeListItem.js src/QuestionListItem.js
Define class BoardListItem, NoticeListItem, and QuestionListItem, which consist notice, board and questions.

#### src/Settings/Setting.js
Thank you in advance! Your donation helps us a lot.

#### src/Students/ClassListItem.js src/Students/RecordListItem.js src/Students/StudentListItem.js
Define class ClassListItem, RecordListItem, StudentListItem, which consist classes, records, students' list.

#### src/Students/InstructorNote.js src/Students/InstructorNoteAddModify.js
Get instructor notes from firebase, and add or modify past notes.

#### src/Students/StudentProfile.js
Make profile for each student.

#### src/Students/ClassRecord.js
Get class records from firebase.

#### src/UploadClssRecord/ClassRecord.js
Uploading classrecord to firebase in second tab.

#### src/config/fire.js
Initializie firebase, get data from firebase, and put data into firebase.

