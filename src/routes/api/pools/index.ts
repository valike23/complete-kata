import { Category } from "../../../Controllers/category";
import { Competition } from "../../../Controllers/competition";
import { Entry, Ientry } from "../../../Controllers/entries";
import { EpoolStatus, Ipool, Pool, poolEntries } from "../../../Controllers/pools";

export async function post(req, res) {
    try {

        let body = JSON.parse(req.fields.body);
        console.log(body);
        const activeCompetition = await Competition.findOne({ where: { active: true } });
        let pool: Ipool = {};
        pool.poolName = body.poolName;
        pool.competitionId = activeCompetition.id;
        pool.categoryId = body.categoryId;
        try {
            const resp = await Pool.create(pool as any);
            let entries = body.entries as any[];
            let myPoolEntries = [];
            entries.forEach((entry: Ientry) => {
                myPoolEntries.push({ poolId: resp.id, entryId: entry.id });
            })
            const resp2 = await poolEntries.bulkCreate(myPoolEntries);
            if (resp2) {
                const resp3 = await Category.update({ isDrafted: true }, { where: { id: body.categoryId } });
                if (resp3) {
                    res.json({
                        status: "success",
                        body: resp2
                    })
                }

            }
        } catch (error) {
            console.log(error);
            res.json({
                status: 'failed',
                msg: 'pool failed to create'
            })
        }

    } catch (error) {
        console.log(error);
        res.json({
            status: 'failed',
            msg: 'pool failed to create'
        })
    }
}

export async function get(req, res) {
    try {
        const activeCompetition = await Competition.findOne({ where: { active: true } });
        const resp = await Pool.findAll({
            where:
                { competitionId: activeCompetition.id }
        });
        res.json(resp);
    } catch (error) {

    }
}

//this api would activate a pool and make it the pool for the competition controller

export async function put(req, res) {

    try {
        const activeCompetition = await Competition.findOne({ where: { active: true } });
        if (req.query.action == 'pause') {
            const data = await Pool.update({ status: EpoolStatus.PAUSED }, { where: { id: req.query.id } });
            res.json({
                msg: 'pool activated successfully',
                status: true,
                data
            });
        }
        else {
            const activePools = await Pool.findOne({
                where: {
                    status: EpoolStatus.ACTIVE,
                    competitionId: activeCompetition.id
                }
            });
            if (activePools == null) {
                const data = await Pool.update({ status: EpoolStatus.ACTIVE }, { where: { id: req.query.id } });
                res.json({
                    msg: 'pool activated successfully',
                    status: true,
                    data
                });
            }
            else {
                res.json({
                    msg: 'there is a running pool at the moment',
                    status: false
                });
            }
        }

    } catch (error) {
        console.log(error);
        res.status(503).json(error)
    }
}

export async function patch(req, res) {
    try {
        const activeCompetition = await Competition.findOne({ where: { active: true } });
        const resp = await Pool.findOne({
            where:
                { competitionId: activeCompetition.id, status: EpoolStatus.ACTIVE }, include: Entry
        });
        res.json(resp);

    } catch (error) {
        console.log(error);
        res.status(503).json(error)
    }
}

export async function del(req, res) {
    try {
        const resp = await Pool.destroy({ where: { id: req.query.id } });
        console.log(resp);
        res.json(resp);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
