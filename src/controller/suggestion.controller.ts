import 'express-async-errors';
import { Request, Response, NextFunction } from 'express';
//import { getSuggestions } from '../services/suggestion.service';
import Joi from 'joi';
import { Sort } from 'mongodb';
import { db } from '../database/connection';
import { toUnicode } from '../services/unicode';
import { customError } from '../utils/CustomError';
import { getDistance } from '../utils/getDistance';

export const getSuggestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req;

    if (!query) {
      return res
        .status(500)
        .send({ success: false, message: 'No query provided' });
    }

    // validate query with Joi
    const schema = Joi.object({
      q: Joi.string().required(),
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
      radius: Joi.number().optional(),
      sort: Joi.string().valid('distance', 'name').optional(),
    });

    const { error } = schema.validate(query);

    if (error) {
      return Promise.reject(
        customError({
          message: error.details[0].message,
          statusCode: 500,
        })
      );
    }

    const { q, latitude, longitude, sort } = query;

    const searchInputString = toUnicode(q as string);

    const searchQuery = {
      $text: {
        $search: searchInputString,
      },
    } as any;

    const sortQuery: Sort = {
      score: { $meta: 'textScore' },
    };

    const projection = {
      name: 1,
      lat: 1,
      long: 1,
      country: 1,
    };

    const results = await db
      .collection('location_data')
      .find(searchQuery)
      .sort(sortQuery)
      .project(projection)
      .toArray();

    // if latitude and longitude are provided, map through the results and calculate the distance for each result
    if (latitude && longitude) {
      results.forEach((result) => {
        result.distance = getDistance(
          +latitude,
          +longitude,
          +result.lat,
          +result.long
        );
      });
    }

    // if sort is distance, sort the results by distance
    if (sort === 'distance') {
      results.sort((a, b) => a.distance - b.distance);
    }

    // if sort is name, sort the results by name
    if (sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return res.status(200).send({
      success: true,
      data: results,
    });
  } catch (err: any) {
    return next(err);
    /*  return res.status(err.statusCode || 400).send({
      status: false,
      message: err.message || 'Something went wrong',
    }); */
  }
};
