class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString; // queryString is req.query
  }
  filter() {
    const queryObj = { ...this.queryString }; //hard copy of the query string
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //searches for exact matches of the strings. 'b' makes sure that only exact mathces are found. 'g' menas that it will check for multiple occurences, not just one. .replace() accepts a callback function. in the callback fn , for each match, a dollar sign is added.

    this.query = this.query.find(JSON.parse(queryStr)); //Product.find() returns a query. It is stored in variable 'query'

    return this; //returns the entire object so that other methods can be chained to it
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this; //returns the entire object so that other methods can be chained to it
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // '-' is to exclude
    }

    return this; //returns the entire object so that other methods can be chained to it
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // * 1 converts a string to a number '   '||' is for setting default
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; // calculating the number if results we want to skip based on the page requested

    this.query = this.query.skip(skip).limit(limit); //limit defines the amount of results we want in a query. Skip defines the amount of results to be skipped before querying data

    return this; //returns the entire object so that other methods can be chained to it
  }
}

module.exports = APIFeatures;
