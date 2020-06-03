# Refactor Tractor - Whats Cookin: Group Project

### Contributors
* __Kyle Wong__ (GitHub: [KyleWong2510](https://github.com/KyleWong2510))
* __Becca Steinbrecher__ (GitHub: [b-stein](https://github.com/b-stein))
* __Corbin March__ (GitHub: [MarchCorbin](https://github.com/MarchCorbin))

## Abstract
This is a recipe tracking / meal planning application. Users can explore a whole host of recipe options. In this application they can favorite recipes or add them to a to-do list. Opening the recipe card, the user can see exactly what ingredients they own and what they are missing from their pantry. Recipe card also display the cost of recipe ingredients, and instructions.

A user can search for a recipe by genre type, or search by ingredient name. While viewing their pantry, the user can add or subtract items based on if they've just cooked a recipe or went shopping.

 Working off the codebase of a previously completed project, the goal for this project was to refactor the existing code to be more efficient. Many users stories were incomplete or had broken functionality. After building out the missing functionality, we were tasked with replacing local datasets to endpoints linked to an API. Additionally, we added in SASS to our stylesheets, used spy testing in our chai to make sure DOM updates were called, and added in accessibility qualities to our application.

## Learning Goals
* Build on top of pre-existing code that you did not write and navigate someone else’s codebase
* Develop processes for working remotely and submitting pull requests to perform effective code reviews that help ensure the code is accurate and that everyone understands it
* Make network requests to API endpoints to retrieve and manipulate data
* Refactor pre-existing code and use inheritance to DRY up repetitive logic
* Ensure your app is following best practices for accessibility
* Leverage Sass to DRY up your CSS
* Incorporate Webpack to streamline your workflow process
* Leverage Chai Spies to verify that your DOM manipulation is happening

## Setup

Clone down this repository to your local machine.

Once cloned, change into this repo's directy.

Run npm install.

Run npm start.

In your browser, navigate to localhost:8080.


## In Action
![2020-06-02 17 57 59](https://user-images.githubusercontent.com/59381432/83586481-ccf33100-a509-11ea-91f9-9b2325b271ed.gif)

![2020-06-02 17 59 50](https://user-images.githubusercontent.com/59381432/83586516-e8f6d280-a509-11ea-9c71-ec7dd04b38ff.gif)

![2020-06-02 18 00 52](https://user-images.githubusercontent.com/59381432/83586538-f744ee80-a509-11ea-9fee-04275fc9d488.gif)

![2020-06-02 18 06 33](https://user-images.githubusercontent.com/59381432/83586627-3410e580-a50a-11ea-88ad-2e8a93765413.gif)

![2020-06-02 18 07 37](https://user-images.githubusercontent.com/59381432/83586641-3b37f380-a50a-11ea-8cbb-ece33e1a6a28.gif)

![2020-06-02 18 13 00](https://user-images.githubusercontent.com/59381432/83586653-4428c500-a50a-11ea-8310-74020579ef6a.gif)

![2020-06-02 19 49 14](https://user-images.githubusercontent.com/59381432/83586663-4be86980-a50a-11ea-9b71-647a155f75a4.gif)


## Wins
- Writing a very atomic project board from the beginning, and staying on task with our due dates to finish the project on time
- Gaining more practice with SCSS, accessibility installments, network requests, spy testing, and iterator prototypes
- Long, effective pairing hours remotely

## Challenges
- We're very proud of our accessibility features, a user can tab through all the clickables. There is one bug left, when the user exits a recipe card via tabbing, a dark shadow comes across the whole screen. This is the first thing we'd like to fix, given more time, as it arose in the last hours of the project.
- Git flow issues emerged in the last day. For some reason entering git merge master into other branches wouldn't effectively merge the master, so a lot of older work got lost.

## Technologies Used
- JavaScript, ES6
- SCSS / SASS
- Webpack

## Systems/Practices
- git/Version Control
- PR Template
- Project Board
- TDD
