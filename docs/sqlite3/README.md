# sqlite3 data format

This document describes the data format when executing queries using the `sqlite3` binary.

## SELECT query

A SELECT query returns a JSON array containing the data.

### Example with single rows

Command: `sqlite3 -json sample.db "SELECT 1"`

Result:

```json
[
  {
    "1": 1
  }
]
```

### Example with multiple rows

Command: `sqlite3 -json sample.db "SELECT CategoryID, CategoryName, Description FROM Categories LIMIT 3"`

Result:

```json
[
  {
    "CategoryID": 1,
    "CategoryName": "Beverages",
    "Description": "Soft drinks, coffees, teas, beers, and ales"
  },
  {
    "CategoryID": 2,
    "CategoryName": "Condiments",
    "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
  },
  {
    "CategoryID": 3,
    "CategoryName": "Confections",
    "Description": "Desserts, candies, and sweet breads"
  }
]
```

### Example with multiple queries

Sending multiple queries in a single command returns multiple JSON arrays, separated by newlines.

Command: `sqlite3 -json sample.db "SELECT 1; SELECT 2"`

Result:

```json
[
  {
    "1": 1
  }
]
[
  {
    "2": 2
  }
]
```

## UPDATE query

### Default example

Command: `sqlite3 -json sample.db "UPDATE Categories SET Description = 'update' WHERE CategoryId = 4"`

Result: _no output_

### Fetching changed row count

By adding a new query (`SELECT changes()`) to the command text, the number of affected rows is returned.

Command: `sqlite3 -json sample.db "UPDATE Categories SET Description = 'update' WHERE CategoryId = 4; SELECT changes()"`

Result:

```json
[
  {
    "changes()": 3
  }
]
```

### Fetching changed row

By adding the `RETURNING *` statement to the command text, the affected rows are returned.

Command: `sqlite3 -json sample.db "UPDATE Categories SET Description = 'update' WHERE CategoryId > 4 RETURNING *"`

Result:

_Picture column has been omitted from result as it is a blob_

```json
[
  {
    "CategoryID": 5,
    "CategoryName": "Grains/Cereals",
    "Description": "update",
    "Picture": "omitted"
  },
  {
    "CategoryID": 6,
    "CategoryName": "Meat/Poultry",
    "Description": "update",
    "Picture": "omitted"
  },
  {
    "CategoryID": 7,
    "CategoryName": "Produce",
    "Description": "update",
    "Picture": "omitted"
  },
  {
    "CategoryID": 8,
    "CategoryName": "Seafood",
    "Description": "update",
    "Picture": "omitted"
  }
]

```

## Error data format

Errors are returned in plain text, no matter the type of error (invalid column/table or SQL syntax error).

Command: `sqlite3 -json sandbox.db "SEL__ECT 1"`

Result:

```
Error: in prepare, near "SEL__ECT": syntax error
  SEL__ECT 1
  ^--- error here
```
