import { ArgsProps } from 'antd/es/notification/interface';

export const REQUEST_ERROR: ArgsProps = {
  description: 'Request failed',
  duration: 30,
  message: 'Error during the request',
  placement: 'bottomRight',
};

export const REQUEST_SUCCESS = {
  description: 'Request successful',
  duration: 30,
  // message: 'Error during the request',
  placement: 'bottomRight',
}