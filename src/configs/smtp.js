module.exports = {
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    user:process.env.EMAIL,
    pass:process.env.PASS
}