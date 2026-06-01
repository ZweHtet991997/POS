using Microsoft.AspNetCore.Mvc;

namespace NKPOS_V1.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserBL _userBL;

        public UserController(IUserBL userBL)
        {
            _userBL = userBL;
        }

        [HttpPost("api/v1/user-register")]
        public async Task<IActionResult> Register([FromBody] UserModel model)
        {
            return StatusCode(200, await _userBL.RegisterUserAsync(model));
        }

        [HttpPost("api/v1/login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel model)
        {
            return StatusCode(200, await _userBL.Login(model));
        }
    }
}
