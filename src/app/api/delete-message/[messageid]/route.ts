import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const { messageid } = await params;
    const messageId = messageid;

    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        const user = session?.user as User;

        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Authentication required"
            }, { status: 401 });
        }

        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Failed to delete message"
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}
