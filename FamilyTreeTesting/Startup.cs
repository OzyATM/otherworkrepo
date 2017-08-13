using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FamilyTreeTesting.Startup))]
namespace FamilyTreeTesting
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
