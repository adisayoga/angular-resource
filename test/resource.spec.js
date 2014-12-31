'use strict';

describe('Angular resource test', function() {
  var $httpBackend, resource, Employee;

  beforeEach(module('sg-resource'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    resource = $injector.get('resource');
    Employee = resource('/employees/:id', { id: '@employee_id' });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should build resource', function() {
    expect(typeof Employee).toBe('function');
    expect(typeof Employee.query).toBe('function');
    expect(typeof Employee.get).toBe('function');
    expect(typeof Employee.post).toBe('function');
    expect(typeof Employee.put).toBe('function');
    expect(typeof Employee.remove).toBe('function');
  });

  it('should default to empty parameters', function() {
    $httpBackend.expectGET('URL').respond({'lele':''});
    resource('URL').query();
    $httpBackend.flush();
  });

  it('should create resource', function() {
    $httpBackend.expectPOST('/employees', '{"name":"Adi"}').respond({ employee_id: 123, name: 'Adi' });
    var item = Employee.create();
    item.name = 'Adi';
    item.save().then(function(response) {
      expect(response).toEqualData({ employee_id: 123, name: 'Adi' });
    });
    $httpBackend.flush();
  });

  it('should read a single resource', function() {
    $httpBackend.expectGET('/employees/123').respond({ employee_id: 123, name: 'Adi' });
    Employee.get({ id: 123 }).then(function(response) {
      expect(response).toEqualData({ employee_id: 123, name: 'Adi' });
      expect(response instanceof Employee).toBe(true);
    });
    $httpBackend.flush();
  });

  it('should read list of resources', function() {
    $httpBackend.expectGET('/employees').respond([
      { employee_id: 123, name: 'Nengah' },
      { employee_id: 124, name: 'Adi' },
      { employee_id: 125, name: 'Sayoga' }
    ]);
    Employee.query().then(function(responses) {
      expect(responses).toEqualData([
        { employee_id: 123, name: 'Nengah' },
        { employee_id: 124, name: 'Adi' },
        { employee_id: 125, name: 'Sayoga' }
      ]);
      expect(responses[0] instanceof Employee).toBe(true);
      expect(responses[1] instanceof Employee).toBe(true);
      expect(responses[2] instanceof Employee).toBe(true);
    });
    $httpBackend.flush();
  });

  it('should read wrapped list of resources', function() {
    $httpBackend.expectGET('/employees').respond({
      data: [
        { employee_id: 123, name: 'Nengah' },
        { employee_id: 124, name: 'Adi' },
        { employee_id: 125, name: 'Sayoga' }
      ],
      pageNo: 1,
      pageCount: 7
    });
    Employee.query().then(function(responses) {
      expect(responses).toEqualData({
        data: [
          { employee_id: 123, name: 'Nengah' },
          { employee_id: 124, name: 'Adi' },
          { employee_id: 125, name: 'Sayoga' }
        ],
        pageNo: 1,
        pageCount: 7
      });
      expect(responses.data[0] instanceof Employee).toBe(true);
      expect(responses.data[1] instanceof Employee).toBe(true);
      expect(responses.data[2] instanceof Employee).toBe(true);
    });
    $httpBackend.flush();
  });

  it('should read custom wrapped list of resources', function() {
    var EmployeeWrap = resource('/employees', null, { query:  { wrap: 'items' }});

    $httpBackend.expectGET('/employees').respond({
      items: [
        { employee_id: 123, name: 'Nengah' },
        { employee_id: 124, name: 'Adi' },
        { employee_id: 125, name: 'Sayoga' }
      ],
      pageNo: 1,
      pageCount: 7
    });
    EmployeeWrap.query().then(function(responses) {
      expect(responses).toEqualData({
        items: [
          { employee_id: 123, name: 'Nengah' },
          { employee_id: 124, name: 'Adi' },
          { employee_id: 125, name: 'Sayoga' }
        ],
        pageNo: 1,
        pageCount: 7
      });
      expect(responses.items[0] instanceof EmployeeWrap).toBe(true);
      expect(responses.items[1] instanceof EmployeeWrap).toBe(true);
      expect(responses.items[2] instanceof EmployeeWrap).toBe(true);
    });
    $httpBackend.flush();
  });

  it('should update resource', function() {
    $httpBackend.expectPUT('/employees/123', '{"employee_id":123,"name":"Adi"}').
                 respond({ employee_id: 123, name: 'Adi' });
    Employee.put({ employee_id: 123, name: 'Adi' }).then(function(response) {
      expect(response).toEqualData({ employee_id: 123, name: 'Adi' });
    });
    $httpBackend.flush();
  });

  it('should read resource and then update it', function() {
    $httpBackend.expectGET('/employees/123').respond({ employee_id: 123, name: 'Adi' });
    $httpBackend.expectPUT('/employees/123', '{"employee_id":123,"name":"Sayoga"}').
                 respond({ employee_id: 123, name: 'Sayoga' });

    Employee.get({ id: 123 }).then(function(response) {
      response.name = 'Sayoga';
      return response.save();
    }).then(function(response) {
      expect(response).toEqualData({ employee_id: 123, name: 'Sayoga' });
    });
    $httpBackend.flush();
  });

  it('should delete resource', function() {
    $httpBackend.expectDELETE('/employees/123').respond({});
    Employee.remove({ id: 123 }).then(function(response) {
      expect(response).toEqualData({});
    });
    $httpBackend.flush();
  });

  it('should read resource and then delete resource', function() {
    $httpBackend.expectGET('/employees/123').respond({ employee_id: 123, name: 'Adi' });
    $httpBackend.expectDELETE('/employees/123').respond({});

    Employee.get({ id: 123 }).then(function(response) {
      return response.remove();
    }).then(function(response) {
      expect(response).toEqualData({});
    });
    $httpBackend.flush();
  });

});
