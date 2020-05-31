import React, { memo, useContext, useRef, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { post } from 'axios';

import routes from '../../routes';
import { UserContext } from '../../contexts/user';
import { selectMessages, selectCurrentChannelId } from '../../store';
import { useMessagesSocket, useAutoScroll } from '../../hooks';

const validationSchema = Yup.object().shape({
  message: Yup.string().required('Required'),
});

const Chat = () => {
  useMessagesSocket();

  const messagesRef = useRef();
  useAutoScroll(messagesRef);

  const messages = useSelector(selectMessages);
  const { nickname } = useContext(UserContext);
  const currentChannelId = useSelector(selectCurrentChannelId);

  const sendMessage = useCallback(
    async ({ message }, formApi) => {
      const payload = { data: { attributes: { message, nickname } } };
      const url = routes.channelMessagesPath(currentChannelId);

      try {
        const res = await post(url, payload);
        formApi.resetForm();
        return res.data;
      } catch (error) {
        const { message } = error;
        formApi.setErrors({ message });
      }
    },
    [nickname, currentChannelId],
  );

  const form = useFormik({
    initialValues: { message: '' },
    onSubmit: sendMessage,
    validationSchema,
  });

  return (
    <div className="d-flex flex-column h-100">
      <div className="overflow-auto mb-3" ref={messagesRef}>
        {messages.map(({ id, nickname, message }) => (
          <div key={id}>
            <b>{nickname}:</b> {message}
          </div>
        ))}
      </div>
      <Form onSubmit={form.handleSubmit} className="mt-auto">
        <Form.Group>
          <Form.Control
            name="message"
            isInvalid={!!form.errors.message}
            disabled={form.isSubmitting}
            onChange={form.handleChange}
            value={form.values.message}
          />
          <Form.Control.Feedback type="invalid">{form.errors.message}</Form.Control.Feedback>
        </Form.Group>
      </Form>
    </div>
  );
};

export default memo(Chat);