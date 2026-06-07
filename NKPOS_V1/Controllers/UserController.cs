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

        [HttpGet("api/v1/userlist")]
        public async Task<IActionResult> GetUserListAsync()
        {
            return StatusCode(200, await _userBL.GetUserListAsync());
        }

        [HttpPut("api/v1/user/update")]
        public async Task<IActionResult> UpdateUser([FromBody] UserModel model)
        {
            return StatusCode(200, await _userBL.UpdateUser(model));
        }

        [HttpPatch("api/v1/user/inactive")]
        public async Task<IActionResult> InActiveUser(int userId, bool status)
        {
            return StatusCode(200, await _userBL.InActiveUser(userId, status));
        }

        [HttpDelete("api/v1/user/delete")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            return StatusCode(200, await _userBL.DeleteUser(userId));
        }
    }
}
