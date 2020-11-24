/**
 * To authorize the user
 * @param {*} req
 * @param {*} res
 */
export const authorization = async (req, res)=>{
  try {
    const obj = new GoogleCalendar();
    let concentUrl = await obj.authorize();
    if (concentUrl === 'A_GEN') {
      concentUrl = '/event/authSuccess';
    }
    res.redirect(concentUrl);
  } catch (e) {
    Response(res, constants.serverError, 'Login Failed');
  }
};




/**
 * auth success google callback
 *
 * @param {*} req
 * @param {*} res
 */
export const authSuccessGoogle = async (req, res)=>{
  const obj = new GoogleCalendar();
  if (req?.query?.code) {
    await obj.createAuth(req.query.code);
  }
  res.status(constants.statusSuccess).json({
    message: 'Login successful',
  });
};
