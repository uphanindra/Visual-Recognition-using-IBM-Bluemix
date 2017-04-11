/*eslint-env node */
exports.TITLE = 'RAD with IoT';
exports.TITLE1 = 'INSURED with RAD';
exports.TITLE2 = 'INSURER with RAD';
exports.USER = 'Phanindra Uppalapati';
exports.POLICY_NUM = 'POL#000001';
exports.DRIVERID = 'DRVR000001';
exports.DRIVERNAME = 'Phanindra';
exports.UNKNOWN_DRIVER = 'TEMP000001-Undisclosed';

/*Constants required in process of determining Risk*/ 
exports.ALLOWED_SPEED = 30;
exports.ALLOWED_HARSH_BREAKS = 10;
exports.ALLOWED_HARSH_TURNS = 10;
exports.PRE_DETERMINED_RISK = 1.2;
exports.PRE_DETERMINED_PREMIUM = 1000;
exports.SPEED_RISK_RATE = 1.5;
exports.BREAKS_RISK_RATE = 1.1;
exports.TURNS_RISK_RATE = 1.3;
exports.NIGHT_RISK_RATE = 1.5;
exports.DAY_RISK_RATE = 0.75;
