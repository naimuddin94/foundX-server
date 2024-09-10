/* eslint-disable prefer-const */
import { FilterQuery, Query } from 'mongoose';

// QueryBuilder class helps to build and chain Mongoose queries
export class QueryBuilder<T> {
  public query: Record<string, unknown>; // Payload containing query parameters
  public modelQuery: Query<T[], T>; // Mongoose query object for the model

  // Constructor initializes the modelQuery and query parameters
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.query = query;
    this.modelQuery = modelQuery;
  }

  // Method to add a search filter to the query
  search(searchableFields: string[]) {
    let searchTerm = '';

    // If a search term is provided, store it
    if (this.query?.searchTerm) {
      searchTerm = this.query.searchTerm as string;
    }

    // Add $or clause to match search term against the specified fields
    this.modelQuery = this.modelQuery.find({
      $or: searchableFields.map(
        (field) =>
          ({
            [field]: new RegExp(searchTerm, 'i'), // Case-insensitive regex for partial matching
          } as FilterQuery<T>)
      ),
    });
    return this;
  }

  // Method to paginate the results
  paginate() {
    let limit: number = Number(this.query?.limit || 10); // Set default limit to 10 results per page

    let skip: number = 0;

    // Calculate skip value based on the page number
    if (this.query?.page) {
      const page: number = Number(this.query?.page || 1);
      skip = Number((page - 1) * limit);
    }

    // Apply pagination to the query
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // Method to sort the results
  sort() {
    let sortBy = '-createdAt'; // Default sorting by createdAt in descending order

    // Apply custom sorting if provided
    if (this.query?.sortBy) {
      sortBy = this.query.sortBy as string;
    }

    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  // Method to select specific fields in the result
  fields() {
    let fields = '';

    // Parse and format the fields query parameter
    if (this.query?.fields) {
      fields = (this.query?.fields as string).split(',').join(' ');
    }

    // Select the specified fields in the query
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // Method to filter results based on query parameters
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'page', 'limit', 'sortBy', 'fields']; // Exclude non-filterable fields

    // Remove the excluded fields from the query object
    excludeFields.forEach((e) => delete queryObj[e]);

    // Apply filters to the query
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }
}
