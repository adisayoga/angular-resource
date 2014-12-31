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

## Arguments

**url - {string}:**
A parametrized URL template with parameters prefixed by `:` as in `/user/:username`

**paramDefaults - {Object} (optional):**
Default values for url parameters. These can be overridden in actions methods.
Each key value in the parameter object is first bound to url template if present
and then any excess keys are appended to the url search query after the `?`.

Given a template `/path/:verb` and parameter `{verb:'greet', salutation:'Hello'}`
results in URL `/path/greet?salutation=Hello`.

If the parameter value is prefixed with `@` then the value for that parameter will be
extracted from the corresponding property on the data object (provided when
calling an action method).
For example, if the defaultParam object is `{someParam: '@someProp'}` then
the value of someParam will be `data.someProp`.

**actions - {Object} (optional):**
Hash with declaration of custom actions that should extend the default set of
resource actions.

```js
{
  action1: {method:?, params:?, isArray:?, ...},
  action2: {method:?, params:?, isArray:?, ...},
  ...
}
```

Where:

  * `action – {string}`: The name of action. This name becomes the name of the
    method on your resource object.
  * `method – {string}`: Case insensitive HTTP method (e.g. GET, POST, PUT,
    DELETE, JSONP, etc).
  * `params – {Object}`: Optional set of pre-bound parameters for this action.
  * `url – {string}`: action specific url override. The url templating is
     supported just like for the resource-level urls.
  * `isArray – {boolean}`: If true then the returned object for this action is
     an array.
  * `isResource {boolean}`: If true then the returned object will be resource
     object.
  * `wrap - {string}`: Name of wrapped data.

Default actions:

```js
{
  query:  { method: 'GET', isArray: true, isResource: true, wrap: 'data' },
  get:    { method: 'GET', isResource: true },
  post:   { method: 'POST', isResource: true, hasBody: true },
  put:    { method: 'PUT', isResource: true, hasBody: true },
  remove: { method: 'DELETE'
}
```

## Example

```js
var Employee = resource('/employees/:id', { id: '@employee_id' });

// GET: /employees
Employee.query().then(function(employees) {
  // The response will detect automatically if the response is wrapped.
  // Example of wrapped response:
  //
  //   {
  //     data: [{...}, {...}, {...}],
  //     page: { pageNo: 1, pageCount: 10 }
  //   }
  //
  // The default wrap name is 'data', or you can define yourself throught options.
  // For example:
  //
  //   var Employee = resource('/employees/:id', { id: '@employee_id' }, { query:  { wrap: 'your-wrap-name' }});

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
