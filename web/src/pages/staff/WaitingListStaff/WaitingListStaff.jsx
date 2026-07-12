import React, { useState } from "react";
import {
  FaUsers,
  FaClock,
  FaPhoneAlt,
  FaCheck,
  FaChartLine,
} from "react-icons/fa";


const WaitingListStaffPage = () => {


  const [customers, setCustomers] = useState([
    {
      id: 1,
      number: "A001",
      name: "Nguyễn Văn An",
      service: "Đăng ký SIM",
      time: "08:10",
      status: "Đang chờ",
    },
    {
      id: 2,
      number: "A002",
      name: "Trần Thị Bình",
      service: "Đăng ký gói cước",
      time: "08:15",
      status: "Đang chờ",
    },
    {
      id: 3,
      number: "A003",
      name: "Lê Minh Khang",
      service: "Thanh toán cước",
      time: "08:20",
      status: "Đang xử lý",
    },
  ]);




  // khách đã phục vụ
  const [servedCustomers, setServedCustomers] = useState([
    {
      id: 10,
      name: "Phạm Văn Hùng",
      completedTime: new Date(),
    },
  ]);





  // xử lý trạng thái

  const updateStatus = (id, status) => {


    const customer = customers.find(
      item => item.id === id
    );



    // hoàn thành giao dịch

    if (status === "Hoàn thành") {


      setServedCustomers([
        ...servedCustomers,
        {
          ...customer,
          completedTime: new Date()
        }
      ]);



      setCustomers(
        customers.filter(
          item => item.id !== id
        )
      );


      return;

    }





    setCustomers(
      customers.map(item =>
        item.id === id
          ?
          {
            ...item,
            status
          }
          :
          item
      )
    );

  };





  // số khách chờ

  const waitingCount = customers.filter(
    item => item.status === "Đang chờ"
  ).length;





  // khách phục vụ hôm nay

  const today = new Date();


  const servedToday = servedCustomers.filter(item => {


    const date = new Date(
      item.completedTime
    );


    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );


  }).length;





  return (

    <div className="
      min-h-screen
      bg-gray-100
      p-6
    ">



      {/* HEADER */}

      <div className="mb-6">


        <h1 className="
          text-2xl
          font-bold
          text-gray-800
        ">
          Hàng chờ giao dịch
        </h1>


        <p className="
          text-sm
          text-gray-500
          mt-1
        ">
          Quản lý và xử lý khách hàng tại quầy
        </p>


      </div>







      {/* STATISTIC */}

      <div className="
        grid
        grid-cols-3
        gap-5
        mb-6
      ">





        {/* KHÁCH CHỜ */}

        <div className="
          bg-white
          rounded-2xl
          p-5
          shadow-sm
          flex
          justify-between
          items-center
        ">


          <div>

            <p className="
              text-sm
              text-gray-500
            ">
              Khách đang chờ
            </p>


            <h2 className="
              text-3xl
              font-bold
            ">
              {waitingCount}
            </h2>

          </div>


          <div className="
            w-14
            h-14
            rounded-2xl
            bg-red-100
            text-red-600
            flex
            justify-center
            items-center
          ">

            <FaUsers size={25} />

          </div>


        </div>







        {/* ĐÃ PHỤC VỤ */}

        <div className="
          bg-white
          rounded-2xl
          p-5
          shadow-sm
          flex
          justify-between
          items-center
        ">


          <div>

            <p className="
              text-sm
              text-gray-500
            ">
              Đã phục vụ hôm nay
            </p>


            <h2 className="
              text-3xl
              font-bold
            ">
              {servedToday}
            </h2>


          </div>



          <div className="
            w-14
            h-14
            rounded-2xl
            bg-green-100
            text-green-600
            flex
            justify-center
            items-center
          ">

            <FaChartLine size={25} />

          </div>


        </div>








        {/* THỜI GIAN */}

        <div className="
          bg-white
          rounded-2xl
          p-5
          shadow-sm
          flex
          justify-between
          items-center
        ">


          <div>

            <p className="
              text-sm
              text-gray-500
            ">
              Thời gian chờ trung bình
            </p>


            <h2 className="
              text-3xl
              font-bold
            ">
              15 phút
            </h2>


          </div>



          <div className="
            w-14
            h-14
            rounded-2xl
            bg-orange-100
            text-orange-600
            flex
            justify-center
            items-center
          ">

            <FaClock size={25} />

          </div>


        </div>



      </div>









      {/* LIST */}

      <div className="
        bg-white
        rounded-2xl
        p-6
        shadow-sm
      ">


        <div className="
          flex
          justify-between
          items-center
          mb-5
        ">


          <h2 className="
            text-lg
            font-semibold
          ">
            Danh sách khách hàng
          </h2>


          <span className="
            bg-red-100
            text-red-600
            px-4
            py-2
            rounded-full
            text-sm
          ">
            Hàng chờ hôm nay
          </span>


        </div>






        {
          customers.length === 0

            ?

            (

              <div className="
              text-center
              py-10
              text-gray-400
            ">
                Không còn khách hàng đang chờ
              </div>

            )


            :

            (

              <div className="space-y-4">


                {
                  customers.map(item => (


                    <div
                      key={item.id}
                      className="
                  border
                  rounded-2xl
                  p-5
                  flex
                  justify-between
                  items-center
                  hover:shadow-md
                  transition
                "
                    >



                      <div className="
                  flex
                  items-center
                  gap-5
                ">



                        <div className="
                    w-16
                    h-16
                    bg-red-600
                    rounded-2xl
                    text-white
                    flex
                    justify-center
                    items-center
                    font-bold
                    text-lg
                  ">
                          {item.number}
                        </div>





                        <div>


                          <h3 className="
                      font-semibold
                    ">
                            {item.name}
                          </h3>



                          <p className="
                      text-sm
                      text-gray-500
                    ">
                            {item.service}
                          </p>


                          <p className="
                      text-sm
                      text-gray-400
                      mt-1
                    ">
                            {item.time}
                          </p>


                        </div>


                      </div>








                      <div className="
                  flex
                  items-center
                  gap-4
                ">


                        <span className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm

                    ${item.status === "Đang chờ"
                            ?
                            "bg-yellow-100 text-yellow-700"
                            :
                            "bg-blue-100 text-blue-700"
                          }

                  `}>
                          {item.status}
                        </span>





                        {
                          item.status === "Đang chờ"

                          &&

                          <button

                            onClick={() =>
                              updateStatus(
                                item.id,
                                "Đang xử lý"
                              )
                            }

                            className="
                        bg-red-600
                        text-white
                        px-5
                        py-2.5
                        rounded-xl
                        flex
                        items-center
                        gap-2
                      "
                          >

                            <FaPhoneAlt />

                            Gọi khách

                          </button>

                        }





                        {
                          item.status === "Đang xử lý"

                          &&

                          <button

                            onClick={() =>
                              updateStatus(
                                item.id,
                                "Hoàn thành"
                              )
                            }

                            className="
                        bg-green-600
                        text-white
                        px-5
                        py-2.5
                        rounded-xl
                        flex
                        items-center
                        gap-2
                      "
                          >

                            <FaCheck />

                            Hoàn thành

                          </button>

                        }



                      </div>



                    </div>


                  ))
                }


              </div>

            )

        }



      </div>


    </div>

  );

};


export default WaitingListStaffPage;