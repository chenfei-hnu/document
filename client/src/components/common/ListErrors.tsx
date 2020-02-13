import React from 'react';
import { IErrors } from '../../types';

export default function ListErrors({ errors }: { errors: IErrors }) {
  return (
    <ul className="error-messages">
      {
        Object.entries(errors).map(([key, keyErrors], index) => {
          if (keyErrors && keyErrors.map) {
            return keyErrors.map((error) => (
              <li key={index}>
                {key} {error}
              </li>
            ))
          } else if (keyErrors && !keyErrors.map) {
            return (
              <li key={index}>
                {key} {keyErrors}
              </li>
            )
          } else {
            return '';
          }
        })
      }
    </ul>
  );
}
