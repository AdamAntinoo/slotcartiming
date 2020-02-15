# TimingFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.22.

The complete project has two applications. This is the frontend app developed on Angular8 ant the purpose is to receive by a push channel the decoded DS slot car centralite data (E0-28-15-03-00-04-4C-1B-00-00-20-00-15-00-00-12-45-10-47-00-EB-00) and then uodate the timing information for the 8 slot lanes.
Each time a new time arrives then the lane data is updated (this lap time, average lane time, best lap time, laps without incidences, total number of laps).
If the best time lap time is updated the voice should call for it and also if the voice channel is set it should call every lap time.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
