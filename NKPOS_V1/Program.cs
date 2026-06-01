using NKPOS_V1;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//builder.Host.UseSerilog((context, loggerConfiguration) =>
//{
//    loggerConfiguration
//        .ReadFrom.Configuration(context.Configuration) // Reads from appsettings.json
//        .Enrich.FromLogContext()
//        .Enrich.WithThreadId()
//        .Enrich.WithEnvironmentName()
//        .Enrich.WithMachineName();
//});

builder.Services.AddControllers();
builder.Services.AddDbContext(builder);
builder.Services.RegisterServices(builder);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseMiddleware<AuthenticationMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
