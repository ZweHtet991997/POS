namespace NKPOS_V1.Helpers
{
    public static class UserCreatePermission
    {
        // Key = creator role, Value = roles they are allowed to create
        private static readonly Dictionary<EnumUserRole, HashSet<EnumUserRole>> AllowedCreates =
            new()
            {
            { EnumUserRole.SuperAdmin, new HashSet<EnumUserRole>
                { EnumUserRole.SuperAdmin, EnumUserRole.Admin, EnumUserRole.Casher } },

            { EnumUserRole.Admin, new HashSet<EnumUserRole>
                { EnumUserRole.Casher } },

            };

        public static bool CanCreate(EnumUserRole creatorRole, EnumUserRole targetRole)
        {
            return AllowedCreates.TryGetValue(creatorRole, out var allowed) && allowed.Contains(targetRole);
        }
    }
}
