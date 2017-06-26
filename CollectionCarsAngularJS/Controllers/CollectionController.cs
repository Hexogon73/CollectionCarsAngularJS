using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CollectionCarsAngularJS.Models;

namespace CollectionCarsAngularJS.Controllers
{
    [RoutePrefix("cars")]
    public class CollectionController : ApiController
    {
        #region
        /// <summary>
        /// Datastore access context
        /// </summary>
        private CollectionCarsAngularJSDBDataContext db { get; set; }

        /// <summary>
        /// Handles initializing shared properties
        /// </summary>
        public CollectionController()
        {
            // initalize our access to th database
            db = new CollectionCarsAngularJSDBDataContext();
        }

        /// <summary>
        /// Releases managed and unmanaged resources based on parameters
        /// </summary>
        /// <param name="disposing">
        /// True: release managed and unamaged resources,
        /// False: release only unmanaged resources
        /// </param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                // Dispose of our datastore access context
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        #endregion

        
        [Route("cars")]
        public IHttpActionResult GetCars(string sort = null, int numberPage = 1, bool statusSort = false, string search = null)
        {
            // Create a list of view models which we will return
            var carsView = new List<Table>();
            // Change each region into a view model and insert it into the list 
            IQueryable<Table> cars = db.Table;
            switch (sort)
            {
                default:
                    {
                        cars = statusSort ? cars.OrderByDescending(k => k.Id) : cars.OrderBy(k => k.Id);
                    }
                    break;
                case "name":
                    {
                        cars = statusSort ? cars.OrderByDescending(k => k.Name) : cars.OrderBy(k => k.Name);
                    }
                    break;
                case "class":
                    {
                        cars = statusSort ? cars.OrderByDescending(k => k.Class) : cars.OrderBy(k => k.Class);
                    }
                    break;
                case "manufacturer":
                    {
                        cars = statusSort ? cars.OrderByDescending(k => k.Manufacturer) : cars.OrderBy(k => k.Manufacturer);
                    }
                    break;
            }
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                cars = cars.Where(s => s.Name.ToLower().Contains(search) || s.Class.ToLower().Contains(search) || s.Manufacturer.ToLower().Contains(search));
            }
            int pageSize = 5;
            int startIndex = (numberPage - 1) * pageSize;
            cars = cars.Skip(startIndex).Take(pageSize);
            foreach (Table c in cars)
            {
                carsView.Add(new Table
                {
                    Id = c.Id,
                    Name = c.Name,
                    Class = c.Class,
                    Manufacturer = c.Manufacturer
                });
            }
            // Return HTTP 200 with the view model list as body payload
            return Ok(carsView);
        }

        [Route("AddCar")]
        public string AddCar(Table cars)
        {
            if (cars != null)
            {
                db.Table.InsertOnSubmit(cars);
                db.SubmitChanges();
                return "Cars Updated";
            }
            else
            {
                return "Invalid cars";
            }
        }

        [Route("DelCar")]
        public string DelCar(Table cars)
        {
            if (cars != null)
            {
                int no = Convert.ToInt32(cars.Id);
                var carsList = db.Table.Where(x => x.Id == no).FirstOrDefault();
                db.Table.DeleteOnSubmit(carsList);
                db.SubmitChanges();
                return "Car Deleted"; ;
            }
            else
            {
                return "Invalid cars";
            }
        }

        [Route("UpdateCar")]
        public string UpdateCar(Table cars)
        {
            if (cars != null)
            {
                int no = Convert.ToInt32(cars.Id);
                var carsList = db.Table.Where(x => x.Id == no).FirstOrDefault();
                carsList.Name = cars.Name;
                carsList.Class = cars.Class;
                carsList.Manufacturer = cars.Manufacturer;
                db.SubmitChanges();
                return "Car Updated";
            }
            else
            {
                return "Invalid cars";
            }
        }

        [Route("GetCarByNo")]
        public IHttpActionResult GetCarByNo(string id)
        {
            int no = Convert.ToInt32(id);
            var carsList = db.Table.Where(w => w.Id == no);
            return Ok(carsList);
        }

        [Route("GetTotalItems")]
        public IHttpActionResult GetTotalItems(string search = null)
        {
            int count = 1;
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                count = db.Table.Where(s => s.Name.ToLower().Contains(search) || s.Class.ToLower().Contains(search) || s.Manufacturer.ToLower().Contains(search)).Count();
            }
            else
            {
                count = db.Table.Count();
            }
            return Ok(count);
        }
        // GET: api/Collection
        public List<Table> Get()
        {
            using (CollectionCarsAngularJSDBDataContext db = new CollectionCarsAngularJSDBDataContext())
            {
                List<Table> items = db.Table.ToList();
                return items;
            }            
        }

        // GET: api/Collection/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Collection
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Collection/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Collection/5
        public void Delete(int id)
        {
        }
    }
}
