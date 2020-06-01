barebones setup for JavaScript / Node projects replace this with a one-liner phrase describing this project or app

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0b562338c37b419899e6aef6454682f2)](https://app.codacy.com/gh/BuildForSDG/silos?utm_source=github.com&utm_medium=referral&utm_content=BuildForSDG/silos&utm_campaign=Badge_Grade_Settings)
[![Codacy Badge](https://img.shields.io/badge/Code%20Quality-D-red)](https://img.shields.io/badge/Code%20Quality-D-red)


## About

Silos is  a project aimed at doubling productivity of small scale food producers by providing acces to an ecommerce market place where they can showcase their produce, connect with retailers and financial institutions willing to offer grants and loan facilities.


## Why

This project solves:
- The issue of producers not having acess to large market
- Producers not being able to easily access financial services (grants and loans)
- Producers not being reached by eligible retailers

## Usage
 Url


## Setup

Install `npm` or `yarn` if you dont have any of them already installed. We recommend Yarn though.

After clonning the repo to your local machine and moving into the cloned folder, Run `yarn install` to get started by installing dependencies. 

`src/index.js` is the entry to the project and source code should go into the `src` folder.

All tests should be written in the `__tests__' folder. There's a sample in there.

This starter uses [Parcel](https://parceljs.org/getting_started.html) as the bundler. It is much simpler that WebPack and the others

## Migrations

Migrations are saved in the /src/migrations folder
- Create a migration and model with `$ sequelize model:generate --name Test2 --attributes firstName:string,lastName:string,email:string`
- Run all migrations with `$ sequelize db:migrate --env development`
- Rollback all migrations with `$ sequelize db:migrate:undo:all --env development`
Always specify the environments

#### Hints

- Run `npm install` or `yarn install` to get started. We'll assume you are using Yarn.
- Install additional dependencies: `yarn add <dependency-name> [-D]`
- Run tests: `yarn test`
- Run tests with test coverage info: `yarn test:cover`
- Check the codebase for proper syntax and formatting compliance: `yarn lint`
- Run your app in local dev mode: `yarn dev`. 

## Authors

- Godwin Otokina (Technical Team Lead) https://github.com/wincodes https://twitter.com/GodwinOtokina
- Manasseh Omachonu https://github.com/manaraph https://twitter.com/manaraph225
-

## Contributing
If this project sounds interesting to you and you'd like to contribute, thank you!
First, you can send a mail to buildforsdg@andela.com to indicate your interest, why you'd like to support and what forms of support you can bring to the table, but here are areas we think we'd need the most help in this project :
1.  area one (e.g this app is about human trafficking and you need feedback on your roadmap and feature list from the private sector / NGOs)
2.  area two (e.g you want people to opt-in and try using your staging app at staging.project-name.com and report any bugs via a form)
3.  area three (e.g here is the zoom link to our end-of sprint webinar, join and provide feedback as a stakeholder if you can)

## Acknowledgements



## LICENSE
MIT

