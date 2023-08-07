import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { DEFAULT_EXP, redis } from "@/config";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getHotels(userId: number) {
  await listHotels(userId);

  const cachedHotel = await redis.get('cachedHotel')
  if (cachedHotel) return JSON.parse(cachedHotel);
  else {
    const hotels = await hotelRepository.findHotels();
    redis.setEx('cachedHotel', DEFAULT_EXP, JSON.stringify(hotels));
    return hotels;
  }
}

async function getRoomsByHotelId(userId: number, hotelId: number) {
  await listHotels(userId);

  const cachedHotel = await redis.get('cachedHotel')

  if (cachedHotel) return JSON.parse(cachedHotel)

  else {
    const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

    if (!hotel) {
      throw notFoundError();
    }
    redis.setEx('cachedHotel', DEFAULT_EXP, JSON.stringify(hotel));
    return hotel;
  }

  // await listHotels(userId);

  // const cachedRoom = await redis.get('cachedRoom')
  // if (cachedRoom) return JSON.parse(cachedRoom);
  // else {
  //   const room = await hotelRepository.findRoomsByHotelId(hotelId);
  //   redis.setEx('cachedRoom', DEFAULT_EXP, JSON.stringify(room));
  // if (!room) {
  //   throw notFoundError();
  // }
  // return room;
  // }

}

const hotelService = {
  getHotels,
  getRoomsByHotelId,
};

export default hotelService;
