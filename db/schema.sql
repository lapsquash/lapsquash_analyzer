DROP TABLE IF EXISTS users;

CREATE TABLE users (
  uuid TEXT,
  access_token TEXT,
  expires_at INT,
  refresh_token TEXT,
  PRIMARY KEY (uuid)
);

INSERT INTO
  users (
    uuid,
    access_token,
    expires_at,
    refresh_token
  )
VALUES
  (
    '1679839039',
    'access_token',
    1679842639,
    'refresh_token'
  );