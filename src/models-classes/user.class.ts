export class UserModelClass {
  private id: number;
  private name: string;
  private email: string;

  public getId(): number {
    return this.id;
  }

  public setId(id: number): this {
    this.id = id;
    return this;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): this {
    this.name = name;
    return this;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): this {
    this.email = email;
    return this;
  }
}
