V2.0

CREATE TABLE RAD_MAIN
(
  POLICY# VARCHAR(10) NOT NULL,
  START_DATE DATE NOT NULL,
  STOP_DATE DATE NOT NULL,
  DRIVER_ID VARCHAR(10)NOT NULL,
  DRIVER_NAME VARCHAR(30)NOT NULL,
  DAY_MILES FLOAT(2),
  NIGHT_MILES FLOAT(2),
  AVG_SPEED FLOAT(2),
  HARSH_BREAKS INT,
  HARSH_TURNS INT,
  RELATION VARCHAR(15),
  DRIVER_RATE FLOAT(2)
);

V1.0
CREATE TABLE RAD_DRIVER
(
  POLICY# VARCHAR(10) NOT NULL,
  START_DATE DATE NOT NULL,
  STOP_DATE DATE NOT NULL,
  DRIVER_ID VARCHAR(10)NOT NULL,
  DRIVER_NAME VARCHAR(30)NOT NULL,
  DAY_MILES FLOAT,
  NIGHT_MILES FLOAT,
  AVG_SPEED FLOAT,
  HARSH_BREAKS INT,
  HARSH_TURNS INT,
  DRIVER_RATE INT
);

