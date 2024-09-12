import { Request, Response } from "express";
import Task from "../../models/task.model";

// [GET] /tasks
export const index =  async (req: Request, res: Response) => {
    const find = {
        deleted: false
    };

    // Lọc theo trạng thái
    const status = req.query.status;

    if(status) {
        find["status"] = status;
    }
    // Hết Lọc theo trạng thái

    // Tìm kiếm
    if(req.query.keyword){
        const regex = new RegExp(`${req.query.keyword}`, "i");
        find["title"] = regex;
    }
    // Hết Tìm kiếm

     // Sắp xếp
    const sort = {};

    const sortKey = `${req.query.sortKey}`;
    const sortValue = req.query.sortValue;

    if(sortKey && sortValue) {
        sort[sortKey] = sortValue;
    }
    // Hết Sắp xếp

    // Phân trang
    let limitItems: number = 2;
    if(req.query.limitItems){
        limitItems = parseInt(`${req.query.limitItems}`);
    }

    let page: number = 1;
    if(req.query.page){
        page = parseInt(`${req.query.page}`);
    }

    const skip: number = (page - 1) * limitItems;
    // Hết Phân trang

    const tasks = await Task
        .find(find)
        .limit(limitItems)
        .skip(skip)
        .sort(sort);

    res.json(tasks);
};

// [GET] /tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false
    });

    res.json(task);
};

// [PATCH] /tasks/change-status
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.ids;
        const status: string = req.body.status;

        await Task.updateMany({
            _id: { $in: ids }
        }, {
            status: status
        })

        res.json({
            message: "Cập nhật dữ liệu thành công!"
        });
    } catch (error) {
        res.json({
            message: "Not Found"
        })
    }
}