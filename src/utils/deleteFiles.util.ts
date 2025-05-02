import { cloudinary } from "../config/cloudinary.config";


export const deleteFiles = async (public_ids: string[]) => {
	public_ids.forEach(async(public_id) => {
		await cloudinary.uploader.destroy(public_id)
		
	});
};