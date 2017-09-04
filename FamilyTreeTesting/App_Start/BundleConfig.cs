using System.Web;
using System.Web.Optimization;

namespace FamilyTreeTesting
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js", 
                        "~/Scripts/jquery-ui.js",
                        "~/Scripts/jquery.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/sweetalert.js",
                      "~/Scripts/sweetalert.min.js"));

            bundles.Add(new StyleBundle("~/bundles/FamilyTree").Include(
                      "~/Scripts/allClickFunction.js",
                      "~/Scripts/changetexttype.js",
                      "~/Scripts/FreehandDrawingTool.js",
                      "~/Scripts/GeometryReshapingTool.js",
                      "~/Scripts/SnapLinkReshapingTool.js",
                      "~/Scripts/FamilyTreeJs.js"));

            bundles.Add(new StyleBundle("~/bundles/FamilyTreeImproved").Include(
                      "~/Scripts/ImprovedScript/DataModel.js",
                      "~/Scripts/ImprovedScript/LogicToRenderGraphDataConversion.js",
                      "~/Scripts/ImprovedScript/LogicToRenderUnitDataConversion.js",
                      "~/Scripts/ImprovedScript/EventHandler.js",
                      "~/Scripts/ImprovedScript/RenderTemplate.js",
                      "~/Scripts/ImprovedScript/LinkTemplate.js",
                      "~/Scripts/ImprovedScript/FamilyTreeMain.js"));

            bundles.Add(new ScriptBundle("~/bundles/GoJS").Include(
                      "~/Scripts/go-1.7.7-debug.js",
                      "~/Scripts/go-1.7.7.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/sweetalert.css",
                      "~/Content/W3.css",
                      "~/Content/fontselect.css",
                      "~/Content/jquery-ui.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/FontSelection").Include(
                    "~/Scripts/jquery.fontselect.js",
                    "~/Scripts/jquery.fontselect.min.js"));
        }
    }
}
