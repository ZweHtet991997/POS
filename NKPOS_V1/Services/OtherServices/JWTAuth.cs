using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NKPOS_V1.Services.OtherServices
{
    public class JWTAuth
    {
        public string GetJWtToken(User user)
        {
            try
            {
                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, Deployment.IsDevelopment() ? JWTConfig.UATSubject : JWTConfig.Subject),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                new Claim("UserId",user.UserId.ToString()),
                new Claim("UserName",user.UserName),
                new Claim("Email",user.Email),
                new Claim("PhoneNumber",user.PhoneNumber),
                new Claim("Role",user.Role),
                new Claim("BusinessId",user.Business_Id.ToString()),
                new Claim("CreateDate",user.CreatedDate.ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Deployment.IsDevelopment()
                    ? JWTConfig.UATJWTKey : JWTConfig.JWTKey));

                var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    Deployment.IsDevelopment() ? JWTConfig.UATIssuer : JWTConfig.Issuer,
                    Deployment.IsDevelopment() ? JWTConfig.UATAudience : JWTConfig.Audience,
                    claims,
                    expires: DateTime.UtcNow.AddHours(12),
                    signingCredentials: signIn
                    );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            try
            {
                JwtSecurityTokenHandler tokenHandler = new();
                byte[] key = Encoding.UTF8.GetBytes(Deployment.IsDevelopment()
                    ? JWTConfig.UATJWTKey
                    : JWTConfig.JWTKey);

                TokenValidationParameters parameters =
                    new()
                    {
                        RequireExpirationTime = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidAudience = Deployment.IsDevelopment() ? JWTConfig.UATAudience : JWTConfig.Audience,
                        ValidIssuer = Deployment.IsDevelopment() ? JWTConfig.UATIssuer : JWTConfig.Issuer,
                        IssuerSigningKey = new SymmetricSecurityKey(key)
                    };

                ClaimsPrincipal principal = tokenHandler.ValidateToken(
                    token,
                    parameters,
                    out SecurityToken securityToken
                );
                return principal;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
