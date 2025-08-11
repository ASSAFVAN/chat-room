import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsComponent } from './tags';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set maxTags to 3 on mobile', () => {
    window.innerWidth = 300;
    component.ngOnInit();
    expect(component.maxTags).toBe(3);
  });

  it('should call setMaxTags when window is resized', () => {
    const spy = jest.spyOn(component as any, 'setMaxTags');
    component.ngOnInit();
    window.dispatchEvent(new Event('resize'));
    expect(spy).toHaveBeenCalled();
  });
});
