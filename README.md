# Modified version of angular resource

This work just like angular resource, expect it return promise.

I love the simplicity of angular resource, but it lack of some thing. so I create
this service to fulfill my needs:

* It uses promise
* Support for wrapped responses
* Additional put method for updating data

## Installation

Just grab the /dist/resource.min.js and add reference to your app.

## Configuration

```js
// Add dependency into my app
angular.module('my-app', ['sg-resource']);

// Inject resource into controller
angular.module('my-app').controller('MainCtrl', function($scope, resource) {
  // ...
});
```

## Example

```js
var Employee = resource('/employees/:id', { id: '@employee_id' });

// GET: /employees
Employee.query().then(function(employees) {
  // The response will detect automatically if the response is wrapped.
  // Example of wrapped response:
  //   {
  //     items: [{...}, {...}, {...}],
  //     page: { pageNo: 1, pageCount: 10 }
  //   }

  $scope.employees = employees;
});

// GET: /employees?gender=female
Employee.query({ gender: 'female' }).then(function() {
  // Do something with response
});

// GET: /employees/42
Employee.get({ id: 42 }).then(function(employee) {
  // Do something with response
});

// POST: /employees
var newEmployee = Employee.create();
newEmployee.first_name = 'Sasuke';
newEmployee.last_name = 'Uchiha';
newEmployee.save().then(function(response) {
  // Do something with response
});

// PUT: /employees/42
Employee.get({ id: 42 }).then(function(employee) {
  employee.first_name = 'Itachi';
  employee.save();
});

// DELETE: /employees/42
Employee.remove({ id: 42 }).then(function(response) {
  // Do something
});

// Or remove existing item...
Employee.get({ id: 42 }).then(function(employee) {
  employee.remove();
});

// Chaining promises
Employee.get({ id: 42 }).then(function(employee) {
  return employee.remove();
}).then(function(response) {
  // Do something
});
```
