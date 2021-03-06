/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';

import Form from './Form';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Remove from './Remove';
import { base64URLDecode } from '../../common/base64URL';
import { defaultLocale } from '../../Locales';
import { updateNamedEntity } from '../namedTranslatedEntity';
import { useDepartmentTranslations } from '../../hooks';

export default function Update(props) {
  const departmentTranslations = useDepartmentTranslations(
    base64URLDecode(props.departmentId)
  );
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  let department = departmentTranslations[defaultLocale];
  for (let [locale, translation] of Object.entries(departmentTranslations)) {
    department['name-' + locale] = translation.name;
  }

  return (
    <>
      {!showRemoveModal && (
        <Modal show={true} onHide={props.onCancel} size="xl">
          <Modal.Body>
            <div className="container header">
              <h1>Edit: {department && department['name']}</h1>
            </div>

            {department && (
              <Form
                initialValues={department}
                onSubmit={values =>
                  updateNamedEntity(department['@id'], values, props.onCancel)
                }
                onCancel={props.onCancel}
              />
            )}
            <div className="float-left">
              <button
                onClick={() => setShowRemoveModal(true)}
                className="btn btn-blue-text"
              >
                Remove
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
      {showRemoveModal && (
        <Remove
          departmentId={props.departmentId}
          onCancel={() => {
            setShowRemoveModal(false);
          }}
          onRemove={() => {
            // Unwind the stack of modals.
            setShowRemoveModal(false);
            props.onRemove();
          }}
        />
      )}
    </>
  );
}

Update.propTypes = {
  onCancel: PropTypes.func,
  onRemove: PropTypes.func
};
