export interface Imateria {
      "id": string,
      "nome": string,
}

export interface INota{
        id: string,
        nome: string,
        valor: number,
        data: string,
        materia: Imateria
  }


