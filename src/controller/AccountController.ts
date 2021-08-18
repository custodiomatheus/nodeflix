import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import Account from "../database/entity/Account";
import AccountRepository from "../database/repository/AccountRepository";

class FlatController {
  async findAll(req: Request, res: Response): Promise<Response> {
    const accountRepository = getCustomRepository(AccountRepository);

    try {
      const accounts = await accountRepository.findAll();

      if (accounts.length) {
        return res.status(200).send(accounts);
      } else {
        return res.sendStatus(204);
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    const accountRepository = getCustomRepository(AccountRepository);

    try {
      const { email, password, flat } = req.body;
      accountRepository.createAndSave(email, password, flat);

      return res.sendStatus(201);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const accountRepository = getCustomRepository(AccountRepository);

    try {
      const { id, email, flat } = req.body;

      const accountExists = await accountRepository.findOne({ where: { id } });

      if (accountExists) {
        accountRepository.updateById(id, email, flat);
        return res.sendStatus(200);
      } else {
        return res.status(409).send({ message: "Account do not exists" });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const accountRepository = getCustomRepository(AccountRepository);

    try {
      const { id } = req.body;

      const accountExists = await accountRepository.findOne({ where: { id } });

      if (accountExists) {
        accountRepository.deleteById(id);
        return res.sendStatus(200);
      } else {
        return res.status(409).send({ message: "Account do not exists" });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const accountRepository = getCustomRepository(AccountRepository);

    try {
      const { email, password } = req.body;
      const account = await accountRepository.login(email, password);

      if (account) {
        return res.status(200).send(account);
      } else {
        return res.sendStatus(403);
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

export default new FlatController();
