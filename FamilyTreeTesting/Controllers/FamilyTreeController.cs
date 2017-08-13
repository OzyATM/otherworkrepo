using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FamilyTreeTesting.Controllers
{
    public class FamilyTreeController : Controller
    {
        // GET: FamilyTree
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult DrawingFamilyTree()
        {
            return View();
        }
    }
}